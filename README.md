#Tokyo Neighborhood Map Application
------------------------------------
This is a simple single page application using a MVVM architectural pattern
as well as a few APIs.

## Setup
There are two options.
<ol>
    <li>Go to the hosted version which is available at: https://seannam7.github.io/Neighborhood-Map/</li>
    <li>Download the file. Open up the index file and use ctrl + b to open the file in a browser.</li>
</ol>

## Directions


## Design notes & sources
<ol>
    <li>I went with a more descriptive data even though it was more difficult to implement because I believe that clear and discriptive data makes it easier to understand the information later on.</li>
    <li>'this.cities = locations' + 'options: cities' + 'optionsText: 'name''
        <ul>
            <li>These three lines allow me to connect the select element with the name of the locations.
            </li>
        </ul>
    </li>
    <li>index.html: line 14
        <ul>
            <li>Example #3 on website http://knockoutjs.com/documentation/options-binding.html</li>
        </ul>
    </li>
    <li>functions setMapOnAll(), clearMarkers(), and showMarkers() taken from google documentation site
        <ul>
            <li>https://developers.google.com/maps/documentation/javascript/markers</li>
        </ul>
    </li>
    <li>app.js: line 160
        <ul>
            <li>https://developers.google.com/maps/documentation/javascript/examples/marker-animations
        </ul>
    </li>
</ol>

## Important lessons/techniques learned
<ol>
    <li>The use of 'var self = this;' when used inside functions that have a different scope.</li>
</ol>