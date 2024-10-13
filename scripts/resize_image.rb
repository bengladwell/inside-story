require 'mini_magick'

DEST_DIR = 'assets/images'

if ARGV.empty?
  puts "Please provide an image file path."
  exit
end

file_path = ARGV[0]

image = MiniMagick::Image.open(file_path)
# Resize to the shortest side maintaining aspect ratio
image.resize "300x300^"
# Center crop to 300x300
image.gravity "center"
image.crop "300x300+0+0"
# Save the output to DEST_DIR
new_file_path_300 = File.join(DEST_DIR, File.basename(file_path, ".*") + '_300x300' + File.extname(file_path))
image.write(new_file_path_300)

# Create 800px wide version
image_800 = MiniMagick::Image.open(file_path)
image_800.resize "800x"
new_file_path_800 = File.join(DEST_DIR, File.basename(file_path, ".*") + '_800w' + File.extname(file_path))
image_800.write(new_file_path_800)

# Create 400px wide version
image_400 = MiniMagick::Image.open(file_path)
image_400.resize "400x"
new_file_path_400 = File.join(DEST_DIR, File.basename(file_path, ".*") + '_400w' + File.extname(file_path))
image_400.write(new_file_path_400)

puts "Images saved to:"
puts new_file_path_300
puts new_file_path_800
puts new_file_path_400
