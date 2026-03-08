import re
import os

def px_to_rem(match):
    px_val = float(match.group(1))
    rem_val = px_val / 16
    if rem_val == 0:
        return "0"
    return f"{rem_val:g}rem"

def convert_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False
    
    # regex: look for digits followed by px. 
    # Use negative lookbehind to avoid matching px if it's already part of rem (though unlikely)
    # Use word boundary to avoid partial matches
    new_content = re.sub(r'(\d+(?:\.\d+)?)px\b', px_to_rem, content)
    
    if content != new_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        except Exception as e:
            print(f"Error writing {filepath}: {e}")
            return False
    return False

def walk_and_convert(directory):
    count = 0
    # Extensions to process
    valid_extensions = ('.css', '.tsx', '.ts', '.js', '.jsx', '.html', '.scss', '.sass')
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules and .next just in case
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.next' in dirs:
            dirs.remove('.next')
            
        for file in files:
            if file.endswith(valid_extensions):
                filepath = os.path.join(root, file)
                if convert_file(filepath):
                    print(f"Converted: {filepath}")
                    count += 1
    return count

if __name__ == "__main__":
    src_dir = r'c:\Users\DELL\Desktop\family_app\src'
    # Also check tailwind.config.ts if it has hardcoded px
    tailwind_config = r'c:\Users\DELL\Desktop\family_app\tailwind.config.ts'
    
    total = walk_and_convert(src_dir)
    print(f"Finished. Total files converted in src: {total}")
    
    if os.path.exists(tailwind_config):
        if convert_file(tailwind_config):
            print(f"Converted: {tailwind_config}")
