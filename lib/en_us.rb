require File.dirname(__FILE__) + '/translate'

def translations
  YAML.load_file(File.dirname(__FILE__) + '/../translations/en_us.yml')
end