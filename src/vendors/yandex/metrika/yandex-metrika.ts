import {
	IAnalyticsProvider
} from "../../../analytics";

import {
	Configuration
} from "./configuration";

export class YandexMetrika implements IAnalyticsProvider {

	constructor(
		public readonly configuration: Configuration
	) {
	}

	public getHtml(): string {
		return `
			<!-- Yandex.Metrika counter -->
			<script type="text/javascript" >
			   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
			   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
			   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

			   ym(${this.configuration.id}, "init", {
			        clickmap:${this.configuration.clickmap},
			        trackLinks:${this.configuration.trackLinks},
			        accurateTrackBounce:${this.configuration.accurateTrackBounce},
			        webvisor:${this.configuration.webvisor}
			   });
			</script>
			<noscript><div><img src="https://mc.yandex.ru/watch/${this.configuration.id}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
			<!-- /Yandex.Metrika counter -->
		`;
	}
}
