// Crypto2.js

const ivLength = 12; // GCM 권장 IV 길이
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// 비밀번호 기반 키 생성 (PBKDF2 + SHA-256)
async function getKeyFromPassword(password) {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("static-salt"), // 실제 서비스에서는 랜덤 salt 권장
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

// 암호화 함수
async function encryptAESGCM(plainText, password) {
  const iv = window.crypto.getRandomValues(new Uint8Array(ivLength));
  const key = await getKeyFromPassword(password);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plainText)
  );

  const result = {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  };

  return JSON.stringify(result);
}

// 복호화 함수
async function decryptAESGCM(encryptedJSON, password) {
  try {
    const { iv, data } = JSON.parse(encryptedJSON);
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const encryptedBytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    const key = await getKeyFromPassword(password);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      key,
      encryptedBytes
    );

    return decoder.decode(decrypted);
  } catch (e) {
    console.error("복호화 실패:", e);
    return null;
  }
}
