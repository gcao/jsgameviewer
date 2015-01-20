'use strict';

// Default view configuration
jq4gv.extend(jsGameViewer.CONFIG, {
});

jq4gv.extend(jsGameViewer.GameController.prototype, function(){
  // http://learningthreejs.com/data/THREEx/docs/THREEx.GeometryUtils.html
  /**
   * Change the scale of a geometry
   *
   * To make the geometry twice larger in y
   * var v = new THREE.Vector3(1,2,1);
   * scale(geometry, v);
   *
   * @params {THREE.Geometry} geometry the geometry to compute on
   * @params {THREE.Vector3} scale the middlepoint of the geometry
   */
  function scale(geometry, scale) {
    for (var i = 0; i < geometry.vertices.length; i++) {
      var vertex = geometry.vertices[i];
      vertex.multiply(scale);
    }

    return geometry;
  }

  /**
   * Converts the board position to 3D world position.
   * @param {Array} pos The board position.
   * @returns {THREE.Vector3}
   */
  function boardToWorld(pos) {
    var adjustment = 4.25;
    var offset = -2.55;
    var x = (1 + pos[1]) * adjustment + offset;
    var z = (1 + pos[0]) * adjustment + offset;

    return new THREE.Vector3(x, 0.6, z);
  }

  return {
    initView: function(){
      this.container = document.getElementById('container');

      /** @type THREE.WebGLRenderer */
      this.renderer = null;

      /** @type THREE.Scene */
      this.scene = null;

      /** @type THREE.PerspectiveCamera */
      this.camera = null;

      /** @type THREE.OrbitControls */
      this.cameraController = null;

      /** @type Object */
      this.lights = {};

      /** @type Object */
      this.materials = {};

      /** @type THREE.Geometry */
      this.pieceGeometry = null;

      /** @type THREE.Mesh */
      this.boardModel = null;

      /** @type THREE.Mesh */
      this.groundModel = null;

      /**
       * The board square size.
       * @type Number
       * @constant
       */
      this.squareSize = 10;

      /**
       * The board representation.
       * @type Array
       */
      this.board = [];
      for (var i = 0; i < 19; i++) {
        this.board[i] = [];
        for (var j = 0; j < 19; j++) {
          this.board[i][j] = 0;
        }
      }

      this.drawBoard();
    },

    /**
     * Draws the board.
     */
    drawBoard: function () {
      var self = this;
      this.initEngine();
      this.initLights();
      this.initMaterials();

      this.initObjects(function () {
        self.onAnimationFrame();
      });
    },

    addStone: function (row, col, color) {
      var piece = {
        color: color,
        pos: [row, col]
      };
      this.board[row][col] = piece;
      this.addPiece(piece);
    },

    /**
     * Adds a piece to the board.
     * @param {Object} piece The piece properties.
     */
    addPiece: function (piece) {
      var pieceMesh = new THREE.Mesh(this.pieceGeometry);
      var pieceObjGroup = new THREE.Object3D();
      //
      if (piece.color === jsGameViewer.model.STONE_WHITE) {
        pieceObjGroup.color = jsGameViewer.model.STONE_WHITE;
        pieceMesh.material = this.materials.whitePieceMaterial;
      } else {
        pieceObjGroup.color = jsGameViewer.model.STONE_BLACK;
        pieceMesh.material = this.materials.blackPieceMaterial;
      }

      pieceObjGroup.add(pieceMesh);

      //// create shadow plane
      //var shadowSize = squareSize * 0.5;
      //var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(shadowSize, shadowSize, 1, 1), materials.pieceShadowPlane);
      //shadowPlane.rotation.x = -90 * Math.PI / 180;
      //pieceObjGroup.add(shadowPlane);

      pieceObjGroup.position = boardToWorld(piece.pos);

      this.board[piece.pos[0]][piece.pos[1]] = pieceObjGroup;

      this.scene.add(pieceObjGroup);
    },

    /**
     * Initialize some basic 3D engine elements.
     */
    initEngine: function() {
      var viewWidth = this.container.offsetWidth;
      var viewHeight = this.container.offsetHeight;

      // instantiate the WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(viewWidth, viewHeight);

      // create the scene
      this.scene = new THREE.Scene();

      // create camera
      this.camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
      this.camera.position.set(this.squareSize * 4, 120, 150);
      this.cameraController = new THREE.OrbitControls(this.camera, this.container);
      this.cameraController.center = new THREE.Vector3(this.squareSize * 4, 0, this.squareSize * 4);
      //
      this.scene.add(this.camera);

      this.container.appendChild(this.renderer.domElement);
    },

    /**
     * Initialize the lights.
     */
    initLights: function() {
      // top light
      this.lights.topLight = new THREE.PointLight();
      this.lights.topLight.position.set(this.squareSize * 4, 150, this.squareSize * 4);
      this.lights.topLight.intensity = 0.4;

      // white's side light
      this.lights.whiteSideLight = new THREE.SpotLight();
      this.lights.whiteSideLight.position.set(this.squareSize * 4, 100, this.squareSize * 4 + 200);
      this.lights.whiteSideLight.intensity = 0.8;
      this.lights.whiteSideLight.shadowCameraFov = 55;

      // black's side light
      this.lights.blackSideLight = new THREE.SpotLight();
      this.lights.blackSideLight.position.set(this.squareSize * 4, 100, this.squareSize * 4 - 200);
      this.lights.blackSideLight.intensity = 0.8;
      this.lights.blackSideLight.shadowCameraFov = 55;

      // light that will follow the camera position
      this.lights.movingLight = new THREE.PointLight(0xf9edc9);
      this.lights.movingLight.position.set(0, 10, 0);
      this.lights.movingLight.intensity = 0.5;
      this.lights.movingLight.distance = 500;

      // add the lights in the scene
      this.scene.add(this.lights.topLight);
      this.scene.add(this.lights.whiteSideLight);
      this.scene.add(this.lights.blackSideLight);
      this.scene.add(this.lights.movingLight);
    },

    /**
     * Initialize the materials.
     */
    initMaterials: function() {
      // board material
      this.materials.boardMaterial = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('3d_assets/square_light_texture.jpg')
      });

      // ground material
      this.materials.groundMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        map: THREE.ImageUtils.loadTexture('3d_assets/ground.png')
      });

      // dark square material
      this.materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('3d_assets/square_dark_texture.jpg')
      });
      //
      // light square material
      this.materials.lightSquareMaterial = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('3d_assets/square_light_texture.jpg')
      });

      // white piece material
      this.materials.whitePieceMaterial = new THREE.MeshPhongMaterial({
        color: 0xe9e4bd,
        shininess: 20
      });

      // black piece material
      this.materials.blackPieceMaterial = new THREE.MeshPhongMaterial({
        color: 0x444455,
        shininess: 80
      });

      // pieces shadow plane material
      this.materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
        transparent: true,
        map: THREE.ImageUtils.loadTexture('3d_assets/piece_shadow.png')
      });
    },

    /**
     * Initialize the objects.
     * @param {Object} callback Function to call when the objects have been loaded.
     */
    initObjects: function(callback) {
      var self = this;
      var loader = new THREE.JSONLoader();
      var totalObjectsToLoad = 2; // board + the piece
      var loadedObjects = 0; // count the loaded pieces

      // checks if all the objects have been loaded
      function checkLoad() {
        loadedObjects++;

        if (loadedObjects === totalObjectsToLoad && callback) {
          callback();
        }
      }

      // load board
      loader.load('3d_assets/board.js', function (geom) {
        self.boardModel = new THREE.Mesh(geom, self.materials.boardMaterial);
        self.boardModel.position.y = -0.02;

        self.scene.add(self.boardModel);

        checkLoad();
      });

      // load piece
      loader.load('3d_assets/stone.js', function (geometry) {
        var s = 6.6;
        self.pieceGeometry = scale(geometry, new THREE.Vector3(s, s, s));

        checkLoad();
      });

      // add ground
      this.groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), this.materials.groundMaterial);
      this.groundModel.position.set(this.squareSize * 4, -1.52, this.squareSize * 4);
      this.groundModel.rotation.x = -90 * Math.PI / 180;
      //
      this.scene.add(this.groundModel);

      function drawGrids() {
        var gridSize = 4.3;
        var offset = 1.25;

        // https://github.com/mrdoob/three.js/wiki/Drawing-lines
        var material1 = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 1
        });
        var material2 = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 4
        });

        for (var i = 0; i < 19; i++) {
          var material = i == 0 || i == 18 ? material2 : material1;
          var geometry1 = new THREE.Geometry();
          geometry1.vertices.push(new THREE.Vector3(i * gridSize + offset, 0, offset));
          geometry1.vertices.push(new THREE.Vector3(i * gridSize + offset, 0, 18 * gridSize + offset));
          var line1 = new THREE.Line(geometry1, material);
          self.scene.add(line1);

          var geometry2 = new THREE.Geometry();
          geometry2.vertices.push(new THREE.Vector3(offset, 0, i * gridSize + offset));
          geometry2.vertices.push(new THREE.Vector3(18 * gridSize + offset, 0, i * gridSize + offset));
          var line2 = new THREE.Line(geometry2, material);
          self.scene.add(line2);
        }
      }

      drawGrids();

      function drawStars() {
        var starRadius = 0.5;
        var gridSize = 4.3;
        var offset = 1.25;
        var material = new THREE.MeshBasicMaterial({
          color: 0x000000
        });

        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            var pointX = i * 6 + 3;
            var pointY = j * 6 + 3;

            var object = new THREE.Mesh(new THREE.CircleGeometry(starRadius, 32, 0, Math.PI * 2), material);
            object.position.set(pointX * gridSize + offset, 0, pointY * gridSize + offset);
            object.rotation.x = 90 * Math.PI / 180;
            object.material.side = THREE.DoubleSide;
            self.scene.add(object);
          }
        }
      }

      drawStars();
    },

    /**
     * The render loop.
     */
    onAnimationFrame: function() {
      requestAnimationFrame(this.onAnimationFrame.bind(this));

      this.cameraController.update();

      // update moving light position
      this.lights.movingLight.position.x = this.camera.position.x;
      this.lights.movingLight.position.z = this.camera.position.z;

      this.renderer.render(this.scene, this.camera);
    }

  };
}());

