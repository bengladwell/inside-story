task :serve do
  sh 'scripts/run_with_config -- bundle exec ruby -r pry -S jekyll serve'
end

task :build do
  sh 'scripts/run_with_config -- bundle exec jekyll build'
end

task :deploy do
  sh 'scripts/run_with_config -- scripts/deploy'
end

task :serve do
  sh 'scripts/run_with_config -- bundle exec ruby -r pry -S jekyll serve'
end

task :clean do
  sh 'bundle exec jekyll clean'
end

namespace :stack do
  task :validate do
    sh 'aws cloudformation validate-template --template-body file://lib/cloudformation.yml'
  end

  task :create do
    sh 'scripts/create_stack.js'
  end

  task :update do
    sh 'scripts/run_with_config -- scripts/update_stack.js'
  end

  task :status do
    sh 'scripts/stack_status.sh'
  end

  task :delete do
    sh 'scripts/destroy_stack.js'
  end
end
