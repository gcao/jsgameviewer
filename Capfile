load 'deploy' if respond_to?(:namespace) # cap2 differentiator

set :application, "jsgameviewer"
set :deploy_to, "/data/apps/#{application}"
 
set :scm, :git
set :repository, "git://github.com/gcao/jsgameviewer.git"
set :git_enable_submodules, true
set :deploy_via, :remote_cache
 
set :user, "root"
set :use_sudo, false

ami_host = `ami_host`.strip

# AMI ami-0d729464: ubuntu 9.04 server base 
server ami_host, :all, :primary => true

namespace :deploy do
  task :start do
  end
  
  task :stop do
  end
  
  task :restart do
  end
end

after "deploy:update_code" do
  # fix file locations in css and javascript
end
