const form = document.querySelector("#repo-form");
const repoInput = document.querySelector("#repo-url");
const statusMessage = document.querySelector("#status");
const resultSection = document.querySelector("#result");
const readmeOutput = document.querySelector("#readme-output");
const downloadButton = document.querySelector("#download-button");

let readmeBlob = null;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusMessage.textContent = "Generating README…";
  resultSection.hidden = true;
  downloadButton.disabled = true;

  try {
    const response = await fetch("/generate-readme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo_url: repoInput.value.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "README generation failed.");
    }

    readmeBlob = await response.blob();
    readmeOutput.value = await readmeBlob.text();
    resultSection.hidden = false;
    downloadButton.disabled = false;
    statusMessage.textContent = "README generated successfully.";
  } catch (error) {
    statusMessage.textContent = error.message;
  }
});

downloadButton.addEventListener("click", () => {
  if (!readmeBlob) return;

  const downloadUrl = URL.createObjectURL(readmeBlob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = "README.md";
  link.click();

  URL.revokeObjectURL(downloadUrl);
});