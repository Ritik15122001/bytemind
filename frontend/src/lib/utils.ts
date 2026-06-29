import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (date: string) => format(new Date(date), "MMM d, yyyy");

export const formatRelative = (date: string) =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const truncate = (str: string, length: number) =>
  str.length > length ? str.slice(0, length) + "..." : str;

export const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");
