import re, glob

# Both blocks to inject — API proxy + WebSocket proxy
API_LOCATION = """
    location /api/ {
        proxy_pass http://localhost:5007/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
"""

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

        changed = False

        if '/api/' not in content:
            content = re.sub(r'(\s+location\s+/\s+\{)', API_LOCATION + r'\1', content, count=1)
            print(f'API proxy added to {conf_path}')
            changed = True
        else:
            print(f'API proxy already configured in {conf_path}')

        if 'socket.io' not in content:
            content = re.sub(r'(\s+location\s+/\s+\{)', WS_LOCATION + r'\1', content, count=1)
            print(f'WebSocket proxy added to {conf_path}')
            changed = True
        else:
            print(f'WebSocket proxy already configured in {conf_path}')

        if changed:
            open(conf_path, 'w').write(content)
        break
    except Exception as e:
        print(f'Skipping {conf_path}: {e}')
