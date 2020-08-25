function addScripts(scriptTagSources, onFinish){
  const loader = function(src, handler) {
		const script = document.createElement("script");
		script.src = src;
		script.onload = script.onreadystatechange = function(){
			script.onreadystatechange = script.onload = null;
			handler();
		}
		document.body.appendChild( script );
	};

	// Invokes run() immediately, shifts the array on each iteration
  (function run(){
		if (scriptTagSources.length != 0) {
			loader(scriptTagSources.shift(), run);
		} else {
			onFinish && onFinish();
		}
  })();
}

function addStyleSheet(fileName) {
  const head = document.head;
  const link = document.createElement("link");

  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = fileName;

  head.appendChild(link);
}

export const setupMediaElementJS = () => {
  const meJSNodes = document.querySelectorAll( '.mejs-video-block' );

  if (meJSNodes.length) {
    addStyleSheet("https://cdn.jsdelivr.net/npm/mediaelement@4.2.16/build/mediaelementplayer-legacy.min.css")

    addScripts([
      "https://cdn.jsdelivr.net/npm/mediaelement@4.2.16/build/mediaelement-and-player.min.js",
      "https://cdn.jsdelivr.net/npm/mediaelement@4.2.16/build/renderers/vimeo.min.js"
    ],function(){
      meJSNodes.forEach(node => {
        const player = new MediaElementPlayer(node, {
          classPrefix: 'mejs-',
          alwaysShowControls: true,
        });
      })
    });
  }
}