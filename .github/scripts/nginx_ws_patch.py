import re, glob

WS_LOCATION = """
    location /socket.io/ {
        proxy_pass http://localhost:5007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
"""

candidates = (
    glob.glob('/etc/nginx/sites-enabled/*') +
    glob.glob('/etc/nginx/sites-available/default') +
    glob.glob('/etc/nginx/conf.d/*.conf')
)

for conf_path in candidates:
    try:
        content = open(conf_path).read()
        if 'newprojectsingurgaon.com' not in content:
            continue
        if 'socket.io' in content:
            print(f'WebSocket proxy already configured in {conf_path}')
            break
        # Insert before the first "location / {" block
        updated = re.sub(r'(\s+location\s+/\s+\{)', WS_LOCATION + r'\1', content, count=1)
        if updated != content:
            open(conf_path, 'w').write(updated)
            print(f'WebSocket proxy added to {conf_path}')
        else:
            print(f'Could not find insertion point in {conf_path} — add manually')
        break
    except Exception as e:
        print(f'Skipping {conf_path}: {e}')
