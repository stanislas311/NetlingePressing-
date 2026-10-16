function octetsVersHex(octets: Uint8Array): string {
  return Array.from(octets)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexVersOctets(hex: string): Uint8Array {
  const propre = hex.trim();
  const resultat = new Uint8Array(propre.length / 2);
  for (let i = 0; i < resultat.length; i++) {
    resultat[i] = Number.parseInt(propre.slice(i * 2, i * 2 + 2), 16);
  }
  return resultat;
}

export function genererSel(): string {
  const octets = new Uint8Array(16);
  crypto.getRandomValues(octets);
  return octetsVersHex(octets);
}

export async function hacherMotDePasse(motDePasse: string, selHex: string): Promise<string> {
  const sel = hexVersOctets(selHex);
  const mot = new TextEncoder().encode(motDePasse);
  const concat = new Uint8Array(sel.length + mot.length);
  concat.set(sel, 0);
  concat.set(mot, sel.length);
  const empreinte = await crypto.subtle.digest('SHA-256', concat);
  return octetsVersHex(new Uint8Array(empreinte));
}

export async function verifierMotDePasse(
  motDePasse: string,
  selHex: string,
  empreinte: string
): Promise<boolean> {
  const calculee = await hacherMotDePasse(motDePasse, selHex);
  return calculee === empreinte;
}
