async function encryptNote() {
  const note = document.getElementById("note").value;
  const password = document.getElementById("password").value;
  const output = document.getElementById("output");

  if (!note || !password) {
    output.textContent = "Note and password are required.";
    return;
  }

  const enc = new TextEncoder();
  const key = await crypto.subtle.digest("SHA-256", enc.encode(password));
  const data = enc.encode(note);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: data.slice(0, 12) }, await crypto.subtle.importKey("raw", key, "AES-GCM", false, ["encrypt"]), data);

  const base64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  localStorage.setItem("secureNote", base64);
  output.textContent = "Note encrypted and saved locally.";
}

async function decryptNote() {
  const password = document.getElementById("password").value;
  const output = document.getElementById("output");
  const base64 = localStorage.getItem("secureNote");

  if (!base64 || !password) {
    output.textContent = "No saved note or password missing.";
    return;
  }

  const enc = new TextEncoder();
  const key = await crypto.subtle.digest("SHA-256", enc.encode(password));
  const encrypted = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  try {
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: encrypted.slice(0, 12) }, await crypto.subtle.importKey("raw", key, "AES-GCM", false, ["decrypt"]), encrypted);
    output.textContent = new TextDecoder().decode(decrypted);
  } catch {
    output.textContent = "Decryption failed. Wrong password?";
  }
}
#digital-tools {
  padding: 2rem;
  background: #f9f9f9;
}

.product-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.product-card h3 {
  margin-top: 0;
}

.product-card ul {
  padding-left: 1.2rem;
}
