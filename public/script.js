const form = document.getElementById("searchForm");
const resultsDiv = document.getElementById("results");

resultsDiv.addEventListener("click", async (e) => {
	if (e.target.tagName === "LI") {
		const textToCopy = 'open "/System/Volumes/Data' + e.target.textContent + '"';

		try {
			await navigator.clipboard.writeText(textToCopy);
			console.log("Copied:", textToCopy);
			showFloatingMessage(`Copied: ${textToCopy}`);

			// Optional visual feedback
			e.target.style.backgroundColor = "#ffd6e0"; // light pink flash
			setTimeout(() => {
				e.target.style.backgroundColor = "";
			}, 300);
		} catch (err) {
			console.log("Failed to copy text:", err);
			showFloatingMessage(`Error: failed to copy`);
		}
	}
});

// resultsDiv.addEventListener("click", async (e) => {
// 	if (e.target.tagName === "LI") {
// 		const textToCopy = `"` + "/System/Volumes/Data" + `${e.target.textContent}"`;

// 		// Try modern Clipboard API first
// 		if (navigator.clipboard && navigator.clipboard.writeText) {
// 			try {
// 				await navigator.clipboard.writeText(textToCopy);
// 				console.log("Copied:", textToCopy);
// 				showFloatingMessage(`Copied: ${textToCopy}`);
// 			} catch (err) {
// 				console.log("Failed to copy text:", err);
// 				showFloatingMessage(`Error: failed to copy`);
// 			}
// 		} else {
// 			// Fallback for older browsers
// 			try {
// 				const textarea = document.createElement("textarea");
// 				textarea.value = textToCopy;
// 				// Avoid scrolling to bottom
// 				textarea.style.position = "fixed";
// 				textarea.style.top = "-9999px";
// 				document.body.appendChild(textarea);
// 				textarea.select();
// 				document.execCommand("copy");
// 				document.body.removeChild(textarea);

// 				console.log("Copied (fallback):", textToCopy);
// 				showFloatingMessage(`Copied: "${textToCopy}"`);
// 			} catch (err) {
// 				console.log("Fallback copy failed:", err);
// 				showFloatingMessage("Error: failed to copy");
// 			}
// 		}

// 		// Optional visual feedback
// 		e.target.style.backgroundColor = "#ffd6e0"; // light pink flash
// 		setTimeout(() => {
// 			e.target.style.backgroundColor = "";
// 		}, 300);
// 	}
// });

// --- Floating message helper ---
function showFloatingMessage(msg) {
	const floatMsg = document.createElement("div");
	floatMsg.textContent = msg;
	floatMsg.style.position = "fixed";
	floatMsg.style.top = "40px";
	floatMsg.style.left = "50%";
	floatMsg.style.transform = "translateX(-50%)";
	floatMsg.style.background = "rgba(0, 192, 203, 0.95)";
	floatMsg.style.color = "black";
	floatMsg.style.padding = "8px 16px";
	floatMsg.style.borderRadius = "8px";
	floatMsg.style.fontSize = "14px";
	floatMsg.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
	floatMsg.style.transition = "opacity 0.5s ease";
	floatMsg.style.zIndex = "9999";
	floatMsg.style.opacity = "1";

	document.body.appendChild(floatMsg);

	// Fade out after 1 second
	setTimeout(() => {
		floatMsg.style.opacity = "0";
		setTimeout(() => floatMsg.remove(), 500);
	}, 2000);
}

form.addEventListener("submit", async (e) => {
	e.preventDefault(); // stop normal form submission

	const keywordsStr = document.getElementById("searchbox").value.toLowerCase();
	const keywords = keywordsStr.trim().split(" ");

	const query = keywords.map((kw, i) => `keyword${i + 1}=${encodeURIComponent(kw)}`).join("&");

	const res = await fetch(`/search?${query}`);
	const data = await res.json();

	// Display results

	resultsDiv.innerHTML = `
    <h3>Search result: (Total ${data.length})</h3>
    <ol>
      ${data.map((item, index) => `<li><a href="iina://weblink?url=/System/Volumes/Data${item}">${item}</a></li>`).join("")}
    </ol>
  `;
});
