export default function parseHashtags(text) {
  const regex = /(?<=^|\s)(?:[#＃]([a-z0-9]+))(?=$|\s)/gi;
  const matches = [...text.matchAll(regex)];
  return [
    ...new Set(
      matches.map((match) => {
        return match[1].toLowerCase();
      })
    ),
  ];
}
