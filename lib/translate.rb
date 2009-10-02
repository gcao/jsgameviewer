def t(key)
  translations[key]
end

def javascript_keys
  translations.keys
end

def create_js_translation_for locale, to_file
  load File.dirname(__FILE__) + "/#{locale}.rb"
  File.open(to_file, "w") do |f|
    f.print "// DO NOT MODIFY THIS FILE - IT IS AUTO GENERATED BASED ON jsgameviewer/translations/#{locale}.yml\n"
    f.print "window.jsgv_#{locale} = {\n"
    s = ""
    javascript_keys.each do |key|
      s << "  '#{key}': '#{t(key)}',\n"
    end
    f.print s.chop.chop # remove ",\n" 
    f.print "};\n"
    if locale == 'en_us'
      # do not overwrite jsgvTranslations
      f.print "if (!window.jsgvTranslations) window.jsgvTranslations = window.jsgv_#{locale};\n"
    else
      # overwrite jsgvTranslations
      f.print "window.jsgvTranslations = window.jsgv_#{locale};\n"
    end
  end
end