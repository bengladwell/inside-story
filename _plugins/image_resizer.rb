require 'mini_magick'

ASSET_DIR = 'assets/images'

Jekyll::Hooks.register :videos, :post_write do |video|
  dest_dir = File.join(video.site.config['destination'], ASSET_DIR, 'processed')
  FileUtils.mkdir_p(dest_dir)
  resize_image(video.data['image'], dest_dir)
end

def resize_image(filename, dest_dir)
  new_file_path_300 = File.join(dest_dir, File.basename(filename, ".*") + '_300x300' + File.extname(filename))
  unless File.exist?(new_file_path_300)
    image = MiniMagick::Image.open(File.join(ASSET_DIR, filename))
    # Resize to the shortest side maintaining aspect ratio
    image.resize "300x300^"
    # Center crop to 300x300
    image.gravity "center"
    image.crop "300x300+0+0"
    # Save the output to ASSET_DIR
    image.write(new_file_path_300)
    puts "Wrote #{new_file_path_300}"
  end

  # Create 800px wide version
  new_file_path_800 = File.join(dest_dir, File.basename(filename, ".*") + '_800w' + File.extname(filename))
  image_800 = MiniMagick::Image.open(File.join(ASSET_DIR, filename))
  unless File.exist?(new_file_path_800)
    image_800.resize "800x"
    image_800.write(new_file_path_800)
    puts "Wrote #{new_file_path_800}"
  end

  # Create 400px wide version
  new_file_path_400 = File.join(dest_dir, File.basename(filename, ".*") + '_400w' + File.extname(filename))
  unless File.exist?(new_file_path_400)
    image_400 = MiniMagick::Image.open(File.join(ASSET_DIR, filename))
    image_400.resize "400x"
    image_400.write(new_file_path_400)
    puts "Wrote #{new_file_path_400}"
  end
end
