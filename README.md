# Udacity FEND Project - Neighborhood Map

The app features a map of silicon valley tech companies, such as Google, Apple, Facebook, etc. For each company, its location, techcruch information, google places and Flickr images are displayed. 
Check out app here: https://spiningup.github.io/udacity-frontend-neighborhood-map/

## How to use
- Click markers to read techcrunch information in the infowindow.
- Click the link in infowindow to go to its techcrunch page.
- Click "Pictures from Google and Flickr" button in the infowindow to check photos related to this company in a pop up modal.
- Click left/right arrow in the modal to view previous/next photo.
- For Flickr photos, click "Link to Original Flickr Image" link to go to its Flickr page. 
- Click close button in the modal to close modal.
- Click list item to get a zoomed view of the company.
- Filter the list using the input box.
- Click hamburger to show/hide the input box and list.

## Error handling
- If google maps api can't be loaded, you will get "Google Maps can't be loaded" on the landing page.
- If google places photos can't be retrieved, you will get "Failed to get Google photos. Click arrow for Flickr photos." in the pop up modal.
- If Flickr photos can't be retrieved, you will get "Failed to get Flickr photos. Click arrow for Google photos." in the pop up modal.

## Resources Used
- <a href="http://jquery.com/">JQuery</a>
- <a href="http://knockoutjs.com/">Knockout.js</a>
- <a href="https://developers.google.com/maps/documentation/javascript/">Google Maps Javascript API</a>
- <a href="https://www.flickr.com/services/api/">Flickr API</a>
