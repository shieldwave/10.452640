document.addEventListener('DOMContentLoaded', function () {
  loadUserData();

  const redeemBtn = document.getElementById('redeemBtn');
  const activationKeyInput = document.getElementById('activationKey');
  const statusMessage = document.getElementById('statusMessage');
  const buttonText = document.querySelector('.button-text');
  const buttonIcon = document.querySelector('.button-icon');

  redeemBtn?.addEventListener('click', async function () {
    const key = activationKeyInput.value.trim();
    if (!key) return showStatusMessage('Please enter an activation key', 'error');

    setLoadingState(true);
    try {
      const response = await fetch('/api/redeem-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCSRFToken()

        },
        body: JSON.stringify({ key }),
        credentials: 'include'

      });
      const data = await response.json();
      if (response.ok) {
        showStatusMessage('Key redeemed successfully!', 'success');
        activationKeyInput.value = '';
        setTimeout(() => window.location.reload(), 2000);
      } else {
        showStatusMessage(data.error || 'Failed to redeem key', 'error');
      }
    } catch (err) {
      console.error('Redeem error:', err);
      showStatusMessage('Network error. Please try again.', 'error');
    } finally {
      setLoadingState(false);
    }
  });

function setLoadingState(isLoading) {
  const redeemBtn = document.getElementById('redeemBtn');
  const buttonText = document.querySelector('.button-text');
  const buttonIcon = document.querySelector('.button-icon');
  if (!redeemBtn) return;

  redeemBtn.disabled = isLoading;
  if (buttonText) buttonText.textContent = isLoading ? 'Redeeming...' : 'Redeem Key';
  if (buttonIcon) buttonIcon.style.animation = isLoading ? 'spin 1s linear infinite' : '';
}
  activationKeyInput?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') redeemBtn.click();
  });

  const navToggle = document.getElementById('navToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const dashboardContainer = document.getElementById('dashboardContainer');

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    dashboardContainer.classList.toggle('nav-open');
  });

  overlay?.addEventListener('click', () => {
    navToggle.classList.remove('active');
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    dashboardContainer.classList.remove('nav-open');
  });

  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
      document.getElementById(sectionId)?.classList.add('active');
      navToggle?.classList.remove('active');
      sidebar?.classList.remove('open');
      overlay?.classList.remove('show');
      dashboardContainer?.classList.remove('nav-open');
    });
  });

  const autoAPIToggle = document.getElementById('autoAPIToggle');
  if (getCookie('preboughtapiuse') === 'true') autoAPIToggle.checked = true;

  autoAPIToggle?.addEventListener('change', function () {
    const isEnabled = this.checked;
    setCookie('preboughtapiuse', isEnabled ? 'true' : 'false', 365);
    console.log('autoAPIToggle', isEnabled);
  });
const apiInputIds = [
  'APItext_shodan',
  'APItext_vpn',
  'APItext_whois',
  'APItext_virustotal',
  'APItext_ipinfo'
];

async function saveAPIKeysToStorage(data) {
  try {
    const csrfToken = getCSRFToken(); // à définir selon ton système

    const response = await fetch('/api/save-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(data),
      credentials: 'include'

    });

    const result = await response.json();

    if (!result.success) {
      console.error("Échec de sauvegarde des clés API:", result.error);
      alert("Erreur lors de la sauvegarde des clés.");
    } else {
      console.log("✅ Clés API sauvegardées côté serveur.");
      alert("Clés API sauvegardées !");
    }

  } catch (error) {
    console.error("Erreur lors de la requête vers le serveur:", error);
    alert("Erreur réseau pendant la sauvegarde.");
  }
}function saveAPIKeysOnButtonPress() {
  const data = {};
  apiInputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      data[id] = input.value.trim();
    }
  });
  saveAPIKeysToStorage(data);
}
window.saveAPIKeysOnButtonPress = saveAPIKeysOnButtonPress; // <== expose globalement

async function restoreAPIKeyInputsFromServer() {
  try {
    const response = await fetch('/api/load-keys', {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const result = await response.json();

    if (!result.success) {
      console.warn("❌ Impossible de charger les clés API :", result.error);
      return;
    }

    const data = result.data || {};
    Object.entries(data).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = value;
      } else {
        console.warn(`Champ introuvable pour l'ID: ${id}`);
      }
    });

    console.log("✅ Clés API restaurées depuis le serveur.");

  } catch (err) {
    console.error("❌ Erreur lors du chargement des clés API :", err);
  }
}
let currentSearchType = "ip"; // valeur par défaut

// 📦 Initialisation après chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  restoreAPIKeyInputsFromServer();

  const saveBtn = document.getElementById('saveAPI');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveAPIKeysOnButtonPress);
  } else {
    console.warn('Save button with ID "saveAPI" not found.');
  }
});
document.addEventListener('click', function (e) {
  const saveBtn = e.target.closest('#saveAPI');
  if (saveBtn) {
    saveAPIKeysOnButtonPress();
  }
});
  // Particle animation
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
    particle.style.opacity = `${Math.random() * 0.5 + 0.2}`;
    document.getElementById('particles')?.appendChild(particle);
    setTimeout(() => particle.remove(), 25000);
  }

  setInterval(createParticle, 2000);
  for (let i = 0; i < 5; i++) setTimeout(createParticle, i * 400);
});

async function loadUserData() {
  try {
    const response = await fetch('/api/user/data', { credentials: 'include' });
    const data = await response.json();
    if (!data.success) return showStatusMessage(data.error, 'error');
    document.getElementById('username').textContent = data.user_data.username;
    const planDiv = document.querySelector('.stat-value');
	if (planDiv) planDiv.textContent = data.user_data.plan ? capitalize(data.user_data.plan) : 'No Plan';
  } catch (err) {
    console.error('User data error:', err);
    showStatusMessage('Unable to load user data.', 'error');
  }
}

document.getElementById('searchBtnLTC').addEventListener('click', async () => {
  const csrfToken = getCSRFToken();
  const qrCodeDiv = document.getElementById('qr_code');
  const transactionsList = document.getElementById('transactions_ltc');

  try {
    const response = await fetch('/tools/ltc_wallet', {
      method: 'GET',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      credentials: 'include'
    });

	if (!response.ok) {
	  if (response.status === 429) {
		const data = await response.json();
		if (data.cooldown) {
		  showCooldownMessage(data.message);
		  return;
		}
	  }
	  throw new Error('Server returned an error.');
	}
    const data = await response.json(); // expects { transactions: [ ... ] }

    // Insert QR Code
    qrCodeDiv.innerHTML = `<img src="/static/images/qr_placeholder.png" alt="QR Code" style="width: 120px; height: 120px;" />`;

    // Insert Transactions
    transactionsList.innerHTML = ''; // Clear previous content
    if (data.transactions && data.transactions.length > 0) {
      data.transactions.forEach(tx => {
        const li = document.createElement('li');
        li.textContent = tx;
        transactionsList.appendChild(li);
      });
    } else {
      transactionsList.innerHTML = '<li>No transactions found.</li>';
    }

  } catch (err) {
    console.error('Error:', err);
    qrCodeDiv.innerHTML = '<p style="color:red;">Failed to load wallet info.</p>';
    transactionsList.innerHTML = '';
  }
});
document.getElementById('searchBtnLTCpriv').addEventListener('click', async () => {
  const csrfToken = getCSRFToken();

	try {
	  const response = await fetch('/tools/ltc_wallet_private', {
		method: 'GET',
		headers: { 'X-CSRF-Token': csrfToken },
		credentials: 'include'
	  });

	  if (!response.ok) {
		if (response.status === 429) {
		  const data = await response.json();
		  if (data.cooldown) showCooldownMessage(data.message);
		  return;
		}
		throw new Error();
	  }

	  const data = await response.json();
	  if (data.error) {
		alert(data.error);
		return;
	  }

	  alert(`WARNING\n\nSeed Phrase:\n${data.seed_phrase}\n\nPrivate Key:\n${data.private_key}`);
	} catch (err) {
	  alert('Failed to retrieve sensitive wallet info.');
	}
});
document.getElementById('sendLTC').addEventListener('click', async () => {
  const to = document.getElementById('ltcToAddress').value;
  const amount = document.getElementById('ltcAmount').value;
  const csrfToken = getCSRFToken();

	try {
	  const response = await fetch('/tools/send_ltc', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		  'X-CSRF-Token': csrfToken
		},
		credentials: 'include',
		body: JSON.stringify({ to_address: to, amount: parseFloat(amount) })
	  });

	  if (!response.ok) {
		if (response.status === 429) {
		  const data = await response.json();
		  if (data.cooldown) showCooldownMessage(data.message);
		  return;
		}
		throw new Error();
	  }

	  const data = await response.json();
	  alert(data.message || "Transaction result unknown");
	} catch (err) {
	  alert("Error sending LTC");
	}
});
// Sélection du type de recherche (IP ou domaine)
document.querySelectorAll('.search-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSearchType = btn.getAttribute('data-type');
    document.querySelectorAll('.search-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.getElementById('searchBtnIP').addEventListener('click', async () => {
  const input = document.getElementById('searchQueryIP');
  const fullOutput = document.getElementById('searchFullResults');
  const ipOrDomain = input.value.trim();
  const csrfToken = getCSRFToken();

  if (!ipOrDomain) {
    alert("Please enter an IP or domain.");
    return;
  }

  fullOutput.textContent = "Analyzing...";

	try {
	  const response = await fetch(`/tools/ip_scan_result?value=${encodeURIComponent(ipOrDomain)}&type=${currentSearchType}`, {
		method: 'GET',
		headers: { 'X-CSRF-Token': csrfToken },
		credentials: 'include'
	  });

	  if (!response.ok) {
		if (response.status === 429) {
		  const data = await response.json();
		  if (data.cooldown) showCooldownMessage(data.message);
		  return;
		}
		throw new Error();
	  }

	  const result = await response.text();
	  fullOutput.textContent = result.replace(/<\/?pre>/g, '').trim();
	} catch (err) {
	  console.error("Error :", err);
	  fullOutput.textContent = "Server error.";
	}
});
document.getElementById('searchBtnVuln').addEventListener('click', async () => {
  const input = document.getElementById('searchQueryVuln');
  const output = document.getElementById('VulnFullResults');
  const query = input.value.trim();
  const csrfToken = getCSRFToken();

  if (!query) {
    alert("Please enter an IP or domain.");
    return;
  }

  output.textContent = "Analyzing...";

	try {
	  const response = await fetch(`/tools/vuln_scan_result?value=${encodeURIComponent(query)}`, {
		method: 'GET',
		headers: { 'X-CSRF-Token': csrfToken },
		credentials: 'include'
	  });

	  if (!response.ok) {
		if (response.status === 429) {
		  const data = await response.json();
		  if (data.cooldown) showCooldownMessage(data.message);
		  return;
		}
		throw new Error();
	  }

	  const result = await response.text();
	  output.textContent = result.replace(/<\/?pre>/g, '').trim();
	} catch (err) {
	  console.error("Error:", err);
	  output.textContent = "Server error.";
	}
});
  let selectedTypes = new Set();

  document.querySelectorAll('.search-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');

      // Toggle bouton
      if (selectedTypes.has(type)) {
        selectedTypes.delete(type);
        btn.classList.remove('active');
      } else {
        selectedTypes.add(type);
        btn.classList.add('active');

        // Si Playwright est activé, activer aussi JSdownload
        if (type === 'PLAYWRIGHTpreload') {
          const jsBtn = [...document.querySelectorAll('.search-type-btn')]
            .find(b => b.getAttribute('data-type') === 'JSdownload');

          if (!selectedTypes.has('JSdownload')) {
            selectedTypes.add('JSdownload');
            jsBtn.classList.add('active');
          }
        }
      }
    });
  });

document.getElementById('ClonesearchBtn').addEventListener('click', async () => {
  const input = document.getElementById('searchQuery');
  const query = input.value.trim();
  const csrfToken = getCSRFToken();

  const downloadContainer = document.getElementById('CloneResultContainer');
  const downloadBtn = document.getElementById('downloadZipBtn');

  if (!query) return alert("Please enter a URL.");
  if (selectedTypes.size === 0) return alert("Please select at least one option (JS or Playwright).");

  // Reset UI
  downloadContainer.style.display = 'block';
  downloadBtn.textContent = "Starting...";
  downloadBtn.removeAttribute('href');
  downloadBtn.removeAttribute('download');
  downloadBtn.style.pointerEvents = 'none';
  downloadBtn.style.opacity = '0.6';

  const types = Array.from(selectedTypes).join(',');

  // 1. Logs en temps réel via SSE
  const logSource = new EventSource(`/tools/clone_progress?url=${encodeURIComponent(query)}&types=${encodeURIComponent(types)}`);
  logSource.onmessage = event => {
    const message = event.data.trim();
    if (message) {
      downloadBtn.textContent = message;
    }
  };
  logSource.onerror = () => {
    logSource.close();
  };

  // 2. Attente de la génération du ZIP
  try {
    const response = await fetch(`/tools/clone_result?url=${encodeURIComponent(query)}&types=${encodeURIComponent(types)}`, {
      method: 'GET',
      headers: { 'X-CSRF-Token': csrfToken },
      credentials: 'include'
    });

    if (!response.ok) throw new Error("Request failed.");
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    downloadBtn.href = blobUrl;
    downloadBtn.download = "cloned_site.zip";
    downloadBtn.textContent = "Download ZIP";
    downloadBtn.style.pointerEvents = 'auto';
    downloadBtn.style.opacity = '1';
    logSource.close();

  } catch (err) {
    console.error("Error:", err);
    downloadBtn.textContent = "Error generating file.";
    downloadBtn.style.pointerEvents = 'none';
    logSource.close();
  }
});
async function logout() {
  if (!confirm('Are you sure you want to logout?')) return;

  const response = await fetch('/logout', {
    method: 'POST',
    headers: {
      'X-CSRF-Token': getCSRFToken()
    }
  });

  // Supprime uniquement le cookie 'accountauth' côté client
  document.cookie = 'accountauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  if (response.ok) {
    const result = await response.json();
    if (result.success) {
      window.location.href = '/';
    } else {
      showStatusMessage(result.error || 'Logout failed.', 'error');
    }
  } else {
    showStatusMessage('Logout request failed.', 'error');
  }
}
function showStatusMessage(message, type = 'error') {
  const msg = document.getElementById('statusMessage');
  if (!msg) return alert(message);

  const statusIcon = msg.querySelector('.status-icon svg path');
  const statusText = msg.querySelector('.status-text');
  msg.className = `status-message ${type}`;
  msg.style.display = 'flex';
  statusText.textContent = message;

  if (type === 'success') {
    statusIcon?.setAttribute('d', 'M12 2C6.48...'); // success path
  } else {
    statusIcon?.setAttribute('d', 'M12 2C6.48...'); // error path
  }

  if (type === 'error') {
    setTimeout(() => { msg.style.display = 'none'; }, 5000);
  }
}



function getCSRFToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let c of cookies) {
    const [key, val] = c.split('=');
    if (key === name) return val;
  }
  return null;
}
function showCooldownMessage(text) {
  const box = document.getElementById('statusMessagetime');
  if (!box) return;

  box.style.display = 'flex';
  box.querySelector('.status-text').textContent = text;

  setTimeout(() => {
    box.style.display = 'none';
  }, 5000);
}
// CSS injection
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .status-message {
    align-items: center; padding: 12px 16px; border-radius: 8px;
    margin-top: 16px; display: flex; gap: 12px;
  }
  .status-message.success {
    background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;
  }
  .status-message.error {
    background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;
  }
  .status-icon svg { width: 20px; height: 20px; }
  .redeem-button:disabled { opacity: 0.6; cursor: not-allowed; }
`;
document.head.appendChild(style);
