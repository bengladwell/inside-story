task :build do
  sh 'bundle exec jekyll build'
end

task :serve do
  sh 'scripts/run_with_config -- bundle exec ruby -r pry -S jekyll serve'
end

task :clean do
  sh 'bundle exec jekyll clean'
end
