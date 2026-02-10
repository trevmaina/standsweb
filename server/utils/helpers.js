const getYouTubeID = (url) => {
  if (!url) return null;
  // This regex handles standard watch links, /live/ links, and shortened youtu.be links
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  // Extra fallback for tricky URLs
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") return urlObj.pathname.slice(1);
    if (urlObj.pathname.startsWith("/live/"))
      return urlObj.pathname.split("/")[2];
  } catch (e) {
    return null;
  }
  return null;
};

module.exports = { getYouTubeID };
