import type { SelectorReference } from "@morph-ui/shared";

function escape(value: string) {
  return CSS.escape(value);
}

function isStableId(id: string | null) {
  return Boolean(id) && !/\d{4,}/.test(id ?? "") && !/^react-/.test(id ?? "");
}

function textHash(text: string) {
  let hash = 2166136261;
  const normalized = text.trim().replace(/\s+/g, " ").slice(0, 120);
  for (let index = 0; index < normalized.length; index += 1) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function firstMatchingAttribute(element: Element) {
  const attributes = ["data-testid", "data-test", "data-qa", "data-cy", "aria-label", "name"] as const;
  for (const attribute of attributes) {
    const value = element.getAttribute(attribute);
    if (value) {
      return { attribute, value };
    }
  }
  return null;
}

export function createStableSelector(element: Element): SelectorReference {
  if (isStableId(element.id)) {
    return {
      selector: `#${escape(element.id)}`,
      stableSelector: `#${escape(element.id)}`,
      textHash: textHash(element.textContent ?? ""),
      role: element.getAttribute("role") ?? undefined,
      tagName: element.tagName.toLowerCase(),
      fuzzyText: (element.textContent ?? "").trim().slice(0, 80),
      attributes: {}
    };
  }

  const attr = firstMatchingAttribute(element);
  if (attr) {
    const selector = `${element.tagName.toLowerCase()}[${attr.attribute}="${escape(attr.value)}"]`;
    return {
      selector,
      stableSelector: selector,
      textHash: textHash(element.textContent ?? ""),
      role: element.getAttribute("role") ?? undefined,
      tagName: element.tagName.toLowerCase(),
      fuzzyText: (element.textContent ?? "").trim().slice(0, 80),
      attributes: {
        [attr.attribute]: attr.value
      }
    };
  }

  const parts: string[] = [];
  let current: Element | null = element;

  while (current && parts.length < 4) {
    const tag = current.tagName.toLowerCase();
    const role = current.getAttribute("role");
    const labelledBy = current.getAttribute("aria-label");
    if (isStableId(current.id)) {
      parts.unshift(`#${escape(current.id)}`);
      break;
    }

    if (labelledBy) {
      parts.unshift(`${tag}[aria-label="${escape(labelledBy)}"]`);
      break;
    }

    const siblings = current.parentElement
      ? [...current.parentElement.children].filter((child) => child.tagName === current!.tagName)
      : [];
    const siblingIndex = siblings.indexOf(current) + 1;
    const descriptor = role
      ? `${tag}[role="${escape(role)}"]`
      : `${tag}:nth-of-type(${Math.max(1, siblingIndex)})`;

    parts.unshift(descriptor);
    current = current.parentElement;
  }

  const selector = parts.join(" > ");
  return {
    selector,
    stableSelector: selector,
    textHash: textHash(element.textContent ?? ""),
    role: element.getAttribute("role") ?? undefined,
    tagName: element.tagName.toLowerCase(),
    fuzzyText: (element.textContent ?? "").trim().slice(0, 80),
    attributes: {}
  };
}

export function resolveSelectorReference(reference: SelectorReference, root: ParentNode = document): Element | null {
  const exact = root.querySelector(reference.stableSelector);
  if (exact) {
    return exact;
  }

  const fallbackCandidates = Array.from(root.querySelectorAll(reference.tagName ?? "*"));
  const scored = fallbackCandidates.map((candidate) => {
    let score = 0;
    if (reference.role && candidate.getAttribute("role") === reference.role) {
      score += 0.25;
    }

    for (const [key, value] of Object.entries(reference.attributes)) {
      if (candidate.getAttribute(key) === value) {
        score += 0.25;
      }
    }

    const candidateText = (candidate.textContent ?? "").trim().slice(0, 80);
    if (reference.fuzzyText && candidateText.includes(reference.fuzzyText.slice(0, 18))) {
      score += 0.3;
    }
    if (reference.textHash && textHash(candidate.textContent ?? "") === reference.textHash) {
      score += 0.4;
    }

    return { candidate, score };
  }).sort((left, right) => right.score - left.score);

  return scored[0]?.score && scored[0].score >= 0.35 ? scored[0].candidate : null;
}
