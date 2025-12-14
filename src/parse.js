export default (data) => {
  const newParse = new DOMParser();
  const xml = newParse.parseFromString(data, 'text/xml');

  const parseErr = xml.querySelector('parsererror')
  if (parseErr) {
    const error = new Error(parseErr.textContent)
    error.isParsingError = true
    error.data = data
    throw error
  }



  const channel = xml.querySelector('channel');
  const channelTitle = channel.querySelector('title');
  const channelTitleContent = channelTitle.textContent;
  const channelDescription = channel.querySelector('description');
  const channelDescriptionContent = channelDescription.textContent;

  const itemElements = xml.querySelectorAll('item');
  const items = Array.from(itemElements).map((element) => {
    const titleElem = element.querySelector('title');
    const title = titleElem.textContent;
    const descriptionElem = element.querySelector('description');
    const description = descriptionElem.textContent;
    const linkElem = element.querySelector('link');
    const link = linkElem.textContent;
    return { title, description, link };
  });
  return { title: channelTitleContent, descrpition: channelDescriptionContent, items };
};