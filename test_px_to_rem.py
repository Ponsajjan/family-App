import re
import os

def px_to_rem(match):
    px_val = float(match.group(1))
    rem_val = px_val / 16
    # If it's 0, just return 0
    if rem_val == 0:
        return "0"
    # Format to remove trailing zeros if not needed
    return f"{rem_val:g}rem"

def convert_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False
    
    new_content = re.sub(r'(\d+(?:\.\d+)?)px', px_to_rem, content)
    
    if content != new_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        except Exception as e:
            print(f"Error writing {filepath}: {e}")
            return False
    return False

test_file = r'c:\Users\DELL\Desktop\family_app\src\app\globals.css'
if convert_file(test_file):
    print(f"Converted {test_file}")
else:
    print(f"No changes or error in {test_file}")
