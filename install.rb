require 'fileutils'
require 'Rakefile'

rails_public_dir = File.join(File.dirname(__FILE__), '..', '..', '..', 'public')
dest_dir = File.join(rails_public_dir, 'jsgameviewer')

FileUtils.rm_rf(dest_dir)

Rake::Task["dist"].invoke

FileUtils.cp_r(DIST_DIR, rails_public_dir, :verbose => true)
