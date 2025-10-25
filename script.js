const owner = "9jaboii";
const repository = "aiwebsite";

const statusEl = document.getElementById("status");
const treeSection = document.getElementById("treeSection");
const treeContainer = document.getElementById("treeContainer");
const emptyStateEl = document.getElementById("emptyState");
const branchSelect = document.getElementById("branchSelect");
const searchInput = document.getElementById("searchInput");
const refreshButton = document.getElementById("refreshButton");
const ownerLabel = document.getElementById("repoOwner");
const defaultBranchLabel = document.getElementById("defaultBranch");
const totalFilesLabel = document.getElementById("totalFiles");

let repoTree = null;
let filteredTree = null;
let currentBranch = null;
let totalFiles = 0;

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const message = `GitHub request failed (${response.status} ${response.statusText})`;
    throw new Error(message);
  }
  return response.json();
}

async function loadRepositoryDetails() {
  statusEl.textContent = "Fetching repository metadata…";
  const repoDetails = await fetchJson(
    `https://api.github.com/repos/${owner}/${repository}`
  );

  ownerLabel.textContent = repoDetails.full_name;
  defaultBranchLabel.textContent = repoDetails.default_branch;

  const branches = await fetchJson(
    `https://api.github.com/repos/${owner}/${repository}/branches?per_page=100`
  );

  branchSelect.innerHTML = "";
  branches
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((branch) => {
      const option = document.createElement("option");
      option.value = branch.name;
      option.textContent = branch.name;
      if (branch.name === repoDetails.default_branch) {
        option.selected = true;
      }
      branchSelect.append(option);
    });

  return repoDetails.default_branch;
}

async function loadTree(branch) {
  currentBranch = branch;
  statusEl.textContent = `Loading ${branch}…`;
  treeSection.hidden = true;
  emptyStateEl.hidden = true;

  const tree = await fetchJson(
    `https://api.github.com/repos/${owner}/${repository}/git/trees/${branch}?recursive=1`
  );

  repoTree = buildTree(tree.tree ?? []);
  totalFiles = countFiles(repoTree);
  totalFilesLabel.textContent = totalFiles.toString();
  renderTree(repoTree, searchInput.value.trim().toLowerCase());

  statusEl.textContent = `Showing ${repository} on ${branch}`;
  treeSection.hidden = false;
}

function buildTree(entries) {
  const root = {
    name: repository,
    path: "",
    type: "tree",
    children: [],
  };

  const lookup = { "": root };

  entries.forEach((item) => {
    if (!item.path) return;
    const parts = item.path.split("/");
    parts.reduce((parentPath, segment, index) => {
      const currentPath = parentPath ? `${parentPath}/${segment}` : segment;
      if (!lookup[currentPath]) {
        const isLeaf = index === parts.length - 1;
        const node = {
          name: segment,
          path: currentPath,
          type: isLeaf ? item.type : "tree",
          children: [],
        };
        lookup[currentPath] = node;
        lookup[parentPath].children.push(node);
      }
      return currentPath;
    }, "");
  });

  sortTree(root);
  return root;
}

function sortTree(node) {
  node.children.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === "tree" ? -1 : 1;
  });
  node.children.forEach(sortTree);
}

function countFiles(node) {
  if (node.type === "blob") {
    return 1;
  }
  return node.children.reduce((sum, child) => sum + countFiles(child), 0);
}

function filterTree(node, query) {
  if (!query) {
    return node;
  }

  if (node.type === "blob") {
    return node.name.toLowerCase().includes(query) ? node : null;
  }

  const matchingChildren = node.children
    .map((child) => filterTree(child, query))
    .filter(Boolean);

  if (matchingChildren.length > 0 || node.name.toLowerCase().includes(query)) {
    return {
      ...node,
      children: matchingChildren,
    };
  }

  return null;
}

function renderTree(tree, query) {
  const filtered = filterTree(tree, query);
  filteredTree = filtered;
  treeContainer.innerHTML = "";

  if (!filtered || filtered.children.length === 0) {
    emptyStateEl.hidden = false;
    return;
  }

  emptyStateEl.hidden = true;
  filtered.children.forEach((child) => {
    treeContainer.appendChild(createNodeElement(child, query));
  });
}

function createNodeElement(node, query) {
  const li = document.createElement("li");
  li.className = `tree-node ${node.type === "tree" ? "folder" : "file"}`;

  if (node.type === "tree") {
    const header = document.createElement("div");
    header.className = "node-header";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle folder");
    toggle.innerHTML = getChevronIcon();

    const title = document.createElement("span");
    title.className = "node-title";
    title.appendChild(createIcon("folder"));
    title.append(...highlightText(node.name, query));
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `${node.children.length} item${
      node.children.length === 1 ? "" : "s"
    }`;
    title.appendChild(badge);

    header.append(toggle, title);
    li.appendChild(header);

    const childrenList = document.createElement("ul");
    childrenList.className = "node-children";
    node.children.forEach((child) => {
      childrenList.appendChild(createNodeElement(child, query));
    });
    li.appendChild(childrenList);

    const toggleCollapse = () => {
      li.classList.toggle("collapsed");
      toggle.innerHTML = getChevronIcon(li.classList.contains("collapsed"));
    };

    header.addEventListener("click", toggleCollapse);
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleCollapse();
    });
  } else {
    const title = document.createElement("div");
    title.className = "node-title";
    title.appendChild(createIcon("file"));
    title.append(...highlightText(node.name, query));
    li.appendChild(title);

    const path = document.createElement("div");
    path.className = "node-path";
    path.textContent = node.path;
    li.appendChild(path);
  }

  return li;
}

function createIcon(type) {
  const span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.innerHTML =
    type === "folder"
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19V5a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></svg>`;
  return span;
}

function getChevronIcon(collapsed = false) {
  return collapsed
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
}

function highlightText(text, query) {
  if (!query) {
    return [document.createTextNode(text)];
  }
  const lower = text.toLowerCase();
  const index = lower.indexOf(query);
  if (index === -1) {
    return [document.createTextNode(text)];
  }

  const fragments = [];
  if (index > 0) {
    fragments.push(document.createTextNode(text.slice(0, index)));
  }
  const highlight = document.createElement("span");
  highlight.className = "highlight";
  highlight.textContent = text.slice(index, index + query.length);
  fragments.push(highlight);
  if (index + query.length < text.length) {
    fragments.push(document.createTextNode(text.slice(index + query.length)));
  }
  return fragments;
}

async function initialize() {
  try {
    const defaultBranch = await loadRepositoryDetails();
    await loadTree(defaultBranch);
  } catch (error) {
    console.error(error);
    statusEl.textContent = error.message;
  }
}

branchSelect.addEventListener("change", (event) => {
  const branch = event.target.value;
  loadTree(branch).catch((error) => {
    console.error(error);
    statusEl.textContent = error.message;
  });
});

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  if (!repoTree) return;
  renderTree(repoTree, query);
});

refreshButton.addEventListener("click", () => {
  if (!currentBranch) return;
  loadTree(currentBranch).catch((error) => {
    console.error(error);
    statusEl.textContent = error.message;
  });
});

initialize();
