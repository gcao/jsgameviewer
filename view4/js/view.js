'use strict';

// Default view configuration
jq4gv.extend(jsGameViewer.CONFIG, {
});

jq4gv.extend(jsGameViewer.GameController.prototype, function(){
  var LABELS = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T'];
  var BRANCHES = ['A','B','C','D','E','F','G','H','I','J'];

  return {
  };
}());

var CHECKERS = {
  WHITE: 1,
  BLACK: 2
};

CHECKERS.Game = function (options) {

  options = options || {};

  /**********************************************************************************************/
  /* Private properties *************************************************************************/

  /** @type CHECKERS.BoardController */
  var boardController = null;

  /**
   * The board representation.
   * @type Array
   */
  var board = [];
  for (var i = 0; i < 19; i++) {
    board[i] = [];
    for (var j = 0; j < 19; j++) {
      board[i][j] = 0;
    }
  }


  /**********************************************************************************************/
  /* Private methods ****************************************************************************/

  /**
   * Initializer.
   */
  function init() {
    boardController = new CHECKERS.BoardController({
      containerEl: options.containerEl,
      assetsUrl: options.assetsUrl
    });

    boardController.drawBoard(onBoardReady);
  }

  /**
   * On board ready.
   */
  function onBoardReady() {
    // setup the board pieces
    var addStone = function (row, col, color) {
      var piece = {
        color: color,
        pos: [row, col]
      };
      board[row][col] = piece;
      boardController.addPiece(piece);
    }
    addStone(0, 0, CHECKERS.BLACK);
    addStone(3, 3, CHECKERS.BLACK);
    addStone(3, 4, CHECKERS.WHITE);
    addStone(4, 3, CHECKERS.WHITE);
    addStone(4, 4, CHECKERS.BLACK);
    addStone(3, 15, CHECKERS.BLACK);
    addStone(15, 3, CHECKERS.BLACK);
    addStone(15, 15, CHECKERS.WHITE);
    addStone(18, 18, CHECKERS.WHITE);
  }

  init();
};

CHECKERS.BoardController = function (options) {

  options = options || {};

  /**********************************************************************************************/
  /* Private properties *************************************************************************/

  /**
   * The DOM Element in which the drawing will happen.
   * @type HTMLDivElement
   */
  var containerEl = options.containerEl || null;

  /** @type String */
  var assetsUrl = options.assetsUrl || '';

  /** @type THREE.WebGLRenderer */
  var renderer;

  /** @type THREE.Scene */
  var scene;

  /** @type THREE.PerspectiveCamera */
  var camera;

  /** @type THREE.OrbitControls */
  var cameraController;

  /** @type Object */
  var lights = {};

  /** @type Object */
  var materials = {};

  /** @type THREE.Geometry */
  var pieceGeometry = null;

  /** @type THREE.Mesh */
  var boardModel;

  /** @type THREE.Mesh */
  var groundModel;

  /**
   * The board square size.
   * @type Number
   * @constant
   */
  var squareSize = 10;

  /**
   * The board representation.
   * @type Array
   */
  var board = [];
  for (var i = 0; i < 19; i++) {
    board[i] = [];
    for (var j = 0; j < 19; j++) {
      board[i][j] = 0;
    }
  }

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

  /**********************************************************************************************/
  /* Public methods *****************************************************************************/

  /**
   * Draws the board.
   */
  this.drawBoard = function (callback) {
    initEngine();
    initLights();
    initMaterials();

    initObjects(function () {
      onAnimationFrame();

      callback();
    });
  };

  /**
   * Adds a piece to the board.
   * @param {Object} piece The piece properties.
   */
  this.addPiece = function (piece) {
    var pieceMesh = new THREE.Mesh(pieceGeometry);
    var pieceObjGroup = new THREE.Object3D();
    //
    if (piece.color === CHECKERS.WHITE) {
      pieceObjGroup.color = CHECKERS.WHITE;
      pieceMesh.material = materials.whitePieceMaterial;
    } else {
      pieceObjGroup.color = CHECKERS.BLACK;
      pieceMesh.material = materials.blackPieceMaterial;
    }

    pieceObjGroup.add(pieceMesh);

    //// create shadow plane
    //var shadowSize = squareSize * 0.5;
    //var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(shadowSize, shadowSize, 1, 1), materials.pieceShadowPlane);
    //shadowPlane.rotation.x = -90 * Math.PI / 180;
    //pieceObjGroup.add(shadowPlane);

    pieceObjGroup.position = boardToWorld(piece.pos);

    board[piece.pos[0]][piece.pos[1]] = pieceObjGroup;

    scene.add(pieceObjGroup);
  };


  /**********************************************************************************************/
  /* Private methods ****************************************************************************/

  /**
   * Initialize some basic 3D engine elements.
   */
  function initEngine() {
    var viewWidth = containerEl.offsetWidth;
    var viewHeight = containerEl.offsetHeight;

    // instantiate the WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(viewWidth, viewHeight);

    // create the scene
    scene = new THREE.Scene();

    // create camera
    camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
    camera.position.set(squareSize * 4, 120, 150);
    cameraController = new THREE.OrbitControls(camera, containerEl);
    cameraController.center = new THREE.Vector3(squareSize * 4, 0, squareSize * 4);
    //
    scene.add(camera);

    containerEl.appendChild(renderer.domElement);
  }

  /**
   * Initialize the lights.
   */
  function initLights() {
    // top light
    lights.topLight = new THREE.PointLight();
    lights.topLight.position.set(squareSize * 4, 150, squareSize * 4);
    lights.topLight.intensity = 0.4;

    // white's side light
    lights.whiteSideLight = new THREE.SpotLight();
    lights.whiteSideLight.position.set(squareSize * 4, 100, squareSize * 4 + 200);
    lights.whiteSideLight.intensity = 0.8;
    lights.whiteSideLight.shadowCameraFov = 55;

    // black's side light
    lights.blackSideLight = new THREE.SpotLight();
    lights.blackSideLight.position.set(squareSize * 4, 100, squareSize * 4 - 200);
    lights.blackSideLight.intensity = 0.8;
    lights.blackSideLight.shadowCameraFov = 55;

    // light that will follow the camera position
    lights.movingLight = new THREE.PointLight(0xf9edc9);
    lights.movingLight.position.set(0, 10, 0);
    lights.movingLight.intensity = 0.5;
    lights.movingLight.distance = 500;

    // add the lights in the scene
    scene.add(lights.topLight);
    scene.add(lights.whiteSideLight);
    scene.add(lights.blackSideLight);
    scene.add(lights.movingLight);
  }

  /**
   * Initialize the materials.
   */
  function initMaterials() {
    // board material
    materials.boardMaterial = new THREE.MeshLambertMaterial({
      //map: THREE.ImageUtils.loadTexture(assetsUrl + 'board_texture.jpg')
      map: THREE.ImageUtils.loadTexture(assetsUrl + 'square_light_texture.jpg')
        //map: THREE.ImageUtils.loadTexture(assetsUrl + 'wood-1.jpg')
    });

    // ground material
    materials.groundMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      map: THREE.ImageUtils.loadTexture(assetsUrl + 'ground.png')
    });

    // dark square material
    materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture(assetsUrl + 'square_dark_texture.jpg')
    });
    //
    // light square material
    materials.lightSquareMaterial = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture(assetsUrl + 'square_light_texture.jpg')
    });

    // white piece material
    materials.whitePieceMaterial = new THREE.MeshPhongMaterial({
      color: 0xe9e4bd,
      shininess: 20
    });

    // black piece material
    materials.blackPieceMaterial = new THREE.MeshPhongMaterial({
      color: 0x444455,
      shininess: 80
    });

    // pieces shadow plane material
    materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
      transparent: true,
      map: THREE.ImageUtils.loadTexture(assetsUrl + 'piece_shadow.png')
    });
  }

  /**
   * Initialize the objects.
   * @param {Object} callback Function to call when the objects have been loaded.
   */
  function initObjects(callback) {
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
    loader.load(assetsUrl + 'board.js', function (geom) {
      boardModel = new THREE.Mesh(geom, materials.boardMaterial);
      boardModel.position.y = -0.02;

      scene.add(boardModel);

      checkLoad();
    });

    // load piece
    loader.load(assetsUrl + 'stone.js', function (geometry) {
      var s = 6.6;
      pieceGeometry = scale(geometry, new THREE.Vector3(s, s, s));

      checkLoad();
    });

    // add ground
    groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), materials.groundMaterial);
    groundModel.position.set(squareSize * 4, -1.52, squareSize * 4);
    groundModel.rotation.x = -90 * Math.PI / 180;
    //
    scene.add(groundModel);

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
        scene.add(line1);

        var geometry2 = new THREE.Geometry();
        geometry2.vertices.push(new THREE.Vector3(offset, 0, i * gridSize + offset));
        geometry2.vertices.push(new THREE.Vector3(18 * gridSize + offset, 0, i * gridSize + offset));
        var line2 = new THREE.Line(geometry2, material);
        scene.add(line2);
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
        for (j = 0; j < 3; j++) {
          var pointX = i * 6 + 3;
          var pointY = j * 6 + 3;

          var object = new THREE.Mesh(new THREE.CircleGeometry(starRadius, 32, 0, Math.PI * 2), material);
          object.position.set(pointX * gridSize + offset, 0, pointY * gridSize + offset);
          object.rotation.x = 90 * Math.PI / 180;
          object.material.side = THREE.DoubleSide;
          scene.add(object);
        }
      }
    }

    drawStars();
  }

  /**
   * The render loop.
   */
  function onAnimationFrame() {
    requestAnimationFrame(onAnimationFrame);

    cameraController.update();

    // update moving light position
    lights.movingLight.position.x = camera.position.x;
    lights.movingLight.position.z = camera.position.z;

    renderer.render(scene, camera);
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
};

