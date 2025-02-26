export default (data) => {
  const newParse = new DOMParser();
  const xml = newParse.parseFromString(data, 'text/xml');

  const channel = xml.querySelector('channel');
  const channelTitle = channel.querySelector('title');
  const channelTitleContent = channelTitle.textContent;
  const channelDescription = channel.querySelector('description');
  const channelDescriptionContent = channelDescription.textContent;

  const itemElements = xml.querySelectorAll('item');
  const items = Array.from(itemElements).map((element) => {
    const titleElement = element.querySelector('title');
    const title = titleElement.textContent;
    const descriptionElement = element.querySelector('description');
    const description = descriptionElement.textContent;
    const linkElement = element.querySelector('link');
    const link = linkElement.textContent;
    return { title, description, link };
  });
  return { title: channelTitleContent, description: channelDescriptionContent, items };
};
