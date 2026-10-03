from pathlib import Path
import re
root=Path(__file__).parent
old=(root/'previous-index.html').read_text()
# Preserve the existing favicon, description, and footer.
head=re.search(r'<head>(.*?)</head>',old,re.S)[1]
head=head[:head.index('<style>')]
head=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>','',head)
head+='\n<meta name="theme-color" content="#070c1b">\n<meta name="color-scheme" content="dark">\n'
footer=re.search(r'<footer.*?</footer>',old,re.S)[0]
footer=re.sub(r' style="[^"]*"','',footer)
# Keep the previous standalone storage key so existing best scores survive.
state='''<script>
(()=>{const key='codex:visualization-widget-state-v2:'+JSON.stringify([location.pathname,'']);let saved=null;
try{saved=JSON.parse(localStorage.getItem(key))}catch(_){}
window.openai={widgetState:saved,setWidgetState:async state=>{try{localStorage.setItem(key,JSON.stringify(state))}catch(_){}}};})();
</script>'''
html='<!doctype html>\n<html lang="zh-CN"><head>'+head+'<style>'+(root/'src/site.css').read_text()+'</style></head><body>'+state+'<script>'+(root/'src/celebration.js').read_text()+'</script>'+(root/'src/game.html').read_text()+footer+'</body></html>'
(root/'dist/index.html').write_text(html)
print('Built',len(html.encode()),'bytes')
