
require 'yaml'
require 'fileutils'

# Path to your YAML file
yaml_file = 'src/data/videos.yml'

# Path to the `_videos` directory
videos_dir = '_videos'

# Load YAML data
videos = YAML.load_file(yaml_file)

# Ensure `_videos` directory exists
FileUtils.mkdir_p(videos_dir)

# Loop through the video entries and generate a markdown file for each
videos.each do |video|
  # Define the filename and its content
  slug = video['label'].downcase.gsub(' ', '-')
  filename = File.join(videos_dir, "#{slug}.md")
  # the date attribute is the year concatenated to "0125" if "Hudson" is in the label, else "0814"
  date = video['label'].include?('Hudson') ? "#{video['year']}0125" : "#{video['year']}0814"
  content = <<~HEREDOC
    ---
    layout: video
    slug: #{slug}
    dir: #{video['dir']}
    base_name: #{video['base_name']}
    label: #{video['label']}
    year: #{video['year']}
    image: #{video['image']}
    date: #{date}
    ---
  HEREDOC

  # Write the content to a markdown file
  File.open(filename, 'w') do |file|
    file.write(content)
  end

  puts "Generated file: #{filename}"
end
