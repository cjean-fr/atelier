import { SafeString } from "@cjean-fr/jsx-string";

type IconifyIconName = `${string}:${string}`;
type IconifyAPIOptions = {
  height?: number | "auto" | "unset" | "none";
  width?: number | "auto" | "unset" | "none";
  rotate?: 1 | 2 | 3 | "90deg" | "180deg" | "270deg";
  flip?: "horizontal" | "vertical";
  color?: string;
};

export const fetchIcon = async (
  name: IconifyIconName,
  options: IconifyAPIOptions = {},
) => {
  const url = new URL(`https://api.iconify.design/${name}.svg`);
  for (const [key, value] of Object.entries(options)) {
    if (value) {
      url.searchParams.set(key, value.toString());
    }
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch icon ${name}`);
  }
  return response.text();
};

export const getIcon = async (name: string, size: number = 24) => {
  const icon = await fetchIcon(name as IconifyIconName, {
    height: size,
  });
  return new SafeString(icon);
};
