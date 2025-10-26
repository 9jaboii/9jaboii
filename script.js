const owner = "9jaboii";
const repository = "aiwebsite";

const statusEl = document.getElementById("status");
const listSection = document.getElementById("listSection");
const fileList = document.getElementById("fileList");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const refreshButton = document.getElementById("refreshButton");
const defaultBranchLabel = document.getElementById("defaultBranch");
const fileCountLabel = document.getElementById("fileCount");
const descriptionEl = document.getElementById("description");

let defaultBranch = "main";
let files = [];

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status})`);
  }
  return response.json();
}

async function loadRepository() {
  statusEl.textContent = "Fetching repository details…";
  const repo = await fetchJson(
    `https://api.github.com/repos/${owner}/${repository}`
  );

  defaultBranch = repo.default_branch;
  defaultBranchLabel.textContent = repo.default_branch;
  descriptionEl.textContent = repo.description || "No description provided.";
}

async function loadFiles(branch = defaultBranch) {
  statusEl.textContent = `Loading files from ${branch}…`;
  listSection.hidden = true;
  emptyState.hidden = true;

  const tree = await fetchJson(
    `https://api.github.com/repos/${owner}/${repository}/git/trees/${branch}?recursive=1`
  );

  files = (tree.tree || [])
    .filter((entry) => entry.type === "blob")
    .map((entry) => ({
      path: entry.path,
      size: entry.size ?? 0,
    }));

  fileCountLabel.textContent = files.length.toString();
  renderFiles(searchInput.value.trim().toLowerCase());

  statusEl.textContent = `Showing ${files.length} files on ${branch}`;
  listSection.hidden = false;
}

function renderFiles(query) {
  const filtered = query
    ? files.filter((file) => file.path.toLowerCase().includes(query))
    : files;

  fileList.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  const fragment = document.createDocumentFragment();

  filtered.forEach((file) => {
    fragment.appendChild(createFileItem(file, query));
  });

  fileList.appendChild(fragment);
}

function createFileItem(file, query) {
  const li = document.createElement("li");
  li.className = "file-list__item";

  const title = document.createElement("span");
  title.className = "file-list__name";
  title.append(...highlight(file.path, query));

  const badge = document.createElement("span");
  badge.className = "file-list__meta";
  badge.textContent = formatSize(file.size);

  li.append(title, badge);
  return li;
}

function highlight(text, query) {
  if (!query) {
    return [document.createTextNode(text)];
  }
  const lower = text.toLowerCase();
  const matchIndex = lower.indexOf(query);
  if (matchIndex === -1) {
    return [document.createTextNode(text)];
  }

  const nodes = [];
  if (matchIndex > 0) {
    nodes.push(document.createTextNode(text.slice(0, matchIndex)));
  }
  const mark = document.createElement("mark");
  mark.textContent = text.slice(matchIndex, matchIndex + query.length);
  nodes.push(mark);
  if (matchIndex + query.length < text.length) {
    nodes.push(document.createTextNode(text.slice(matchIndex + query.length)));
  }
  return nodes;
}

function formatSize(bytes) {
  if (!bytes) {
    return "—";
  }
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

async function initialize() {
  try {
    await loadRepository();
    await loadFiles();
  } catch (error) {
    console.error(error);
    statusEl.textContent = error.message;
  }
}

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  renderFiles(query);
});

refreshButton.addEventListener("click", () => {
  loadFiles().catch((error) => {
    console.error(error);
    statusEl.textContent = error.message;
  });
});

initialize();
