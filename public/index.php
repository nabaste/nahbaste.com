<!DOCTYPE HTML>
<html lang="en">

<head>
<?php require $_SERVER['DOCUMENT_ROOT'].'/head.php';?>
<!-- Style -->
<link rel="stylesheet" href="assets/css/main.css" />
<noscript>
	<link rel="stylesheet" href="assets/css/noscript.css" />
</noscript>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>

<body class="landing is-preload" id="body">
	<!-- Google Tag Manager (noscript) -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T5Q6B7D" height="0" width="0"
			style="display:none;visibility:hidden"></iframe></noscript>
	<!-- End Google Tag Manager (noscript) -->
	<!-- Facebook Analytics -->
	<!-- <script>
		window.fbAsyncInit = function () {
			FB.init({
				appId: '{950828529106312}',
				cookie: true,
				xfbml: true,
				version: '{v11.0}'
			});

			FB.AppEvents.logPageView();

		};

		(function (d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) { return; }
			js = d.createElement(s); js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	</script> -->

	<canvas class="threejs is-preload" id="c"></canvas>
	<!-- Page Wrapper -->
	<div id="page-wrapper">

		<!-- Header -->
		<header id="header" class="alt">
			<h2><a href="https://www.nahbaste.com/">Nahuel Basterretche</a></h2>
			<nav id="nav">
				<?php require $_SERVER['DOCUMENT_ROOT'].'/nav.php';?>
			</nav>
		</header>

		<!-- Banner -->
		<section id="banner">
			<div class="inner">
				<div id="side">
					<div id="presentation">
						<!-- <svg src="assets/logo.svg" alt="nahbaste" class="nahbasteLogo"></svg> -->
						<a href="index.html"><object data="assets/logo.svg" type="image/svg+xml">nahbaste</object></a>
						<p> I am a Designer & Developer<br />
							based in Buenos Aires</p>
						<p> I specialize in Mixed Reality<br />
							and 3D interactive experiences</p>
						<p> You can click and drag <br />
							to move my spirit object <br />
							and see what I'm made of</p>
					</div>
					<div id="main">
					</div>
					<ul class="actions special">
						<li><a href="#cta" class="button primary" onclick='FB.AppEvents.logEvent("buttonClicked")'>contact me</a></li>
					</ul>
				</div>
				<div id="section">
					<h2 id="sections" class="text-focus-in">Design</h2>
				</div>
			</div>
			<a href="#three" class="more scrolly">Learn More</a>
		</section>

		<!-- Three -->
		<section id="three" class="wrapper style3 special">
			<div class="inner">
				<header class="major">
					<h1>Engage with your audience <br />in a fun and memorable way</h1>
					<p>Users scroll past your ads and self promoting posts. <br />
						An XR experience will produce the excitement your campaign needs.</p>
				</header>
				<ul class="features">
					<li class="icon solid fa-paper-plane">
						<h3>High Reach</h3>
						<p>Approximately 3.8 billion phones globally have the ability to launch a web XR experience.
							Instagram and Snapchat's usage is only rising and AR has become an integral part of these
							apps. </p>
					</li>
					<li class="icon solid fa-undo-alt">
						<h3>Brand Recall</h3>
						<p>Numerous studies from firms like Accenture, Statista, Snapchat and Facebook have shown that
							branded XR experiences result in higher brand recall and increased purchase intent.</p>
					</li>
					<li class="icon solid fa-camera">
						<h3>Branded user generated content</h3>
						<p>By sharing their branded content, users act as an ambassador for brands. This kind of
							endorsement is
							invaluable for brands and an unique posibility of XR</p>
					</li>
					<li class="icon solid fa-tags">
						<h3>Enhanced Shopping Experience</h3>
						<p>Mixed Reality bridges the digital and in store experiences together, offering quick
							product information and
							allowing brands to present a coherent image to customers </p>
					</li>
					<li class="icon solid fa-heart">
						<h3>Emotional Connection</h3>
						<p>The immersion of Mixed Reality experiences helps create a certain emotional connection
							with customers. Unlike images or banners, AR is interactive and lifelike: consumers can see
							and interact
							with the products and campaigns.</p>
					</li>
					<li class="icon solid fa-ghost">
						<h3>Casual Gaming</h3>
						<p>We know from data that XR games perform exceedingly well as those filters have a higher
							dwell time with users replaying these games to beat their own scores!</p>
					</li>
					<!-- <li class="icon solid fa-pen-square">
						<h3>Want to know more?</h3>
						<p>I write regularly about AR in my <a href="./Blog/index.html">blog</a></p>
					</li> -->
				</ul>
				<header id="second-header" class="major">
					<h2>I craft striking experiences that boost <br />the scope and influence of brands & their
						campaigns.</h2>
					<p>The mixed reality market was valued at USD 1.98 billion in 2020.<br />
						It is expected to register a CAGR of 151.93% over the period 2021 - 2026.</p>
				</header>
			</div>
		</section>

		<!-- Carousel -->
		<section class="carousel">
			<div class="reel">

				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/p/CNn16Cngj_A/">
							<video id="rubik" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/rubikOpt.mp4" type="video/mp4">
								<!-- <source src="assets/videos/rubik.webm" type="video/webm"> -->
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>

				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/p/CSYBN59ATGt/">
							<video id="leopard" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/leopardOpt.mp4" type="video/mp4">
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>
				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/p/CT3P-6UAxob/">
							<video id="hiddenGems" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/hiddenGemsOpt.mp4" type="video/mp4">
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>
				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/p/CQR7uDigJew/">
							<video id="toxic" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/toxicOpt.mp4" type="video/mp4">
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>
				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/ar/761351804493596/">
							<video id="neonSale" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/neoFaceOpt.mp4" type="video/mp4">
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>
				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/p/CQcSpmLAcmV/">
							<video id="sm0lFace" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/sm0lFaceOpt.mp4" type="video/mp4">
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>
				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/ar/226138702515159/">
							<video id="nightclub" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/nightClubOpt.mp4" type="video/mp4">
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>
				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/ar/887337981835325/">
							<video id="spaceHair" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/spaceHairOpt.mp4" type="video/mp4">
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>
				<article class="videosList">
					<div class="video">
						<a href="https://www.instagram.com/ar/1142549559538561/">
							<video id="morningMist" class="videoTag" muted="true" loop preload="none">
								<source src="assets/videos/morningMistOpt.mp4" type="video/mp4">
								Your browser does not support the video tag.
							</video>
						</a>
					</div>
				</article>
			</div>
		</section>


		<!-- CTA -->
		<section id="cta" class="wrapper style4">
			<div class="inner">
				<header>
					<h2>Have I sparked your interest?</h2>
					<p>Let’s have a discovery call and figure out how Mixed Reality can benefit your project.</p>
				</header>

				<form method="post" action="https://formsubmit.co/contact@nahbaste.com">
					<div class="fields">
						<div class="field">
							<label for="name">Name</label>
							<input type="text" name="name" id="name" />
						</div>
						<div class="field">
							<label for="email">Email</label>
							<input type="text" name="email" id="email" />
						</div>
						<div class="field">
							<label for="message">Message</label>
							<textarea name="message" id="message" rows="3"></textarea>
						</div>
					</div>
					<ul class="actions stacked">
						<li><button class="button fit primary" type="submit">Contact Me</button></li>
					</ul>
				</form>
			</div>
		</section>

		<!-- Footer -->
		<footer id="footer">
			<?php require $_SERVER['DOCUMENT_ROOT'].'/footer.php';?>
		</footer>

	</div>

	<!-- Scripts -->
	<script type="module" src="main.js"></script>

</body>

</html>