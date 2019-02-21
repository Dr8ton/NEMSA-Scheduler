const puppeteer = require('puppeteer');

let bookingUrl = 'https://www.booking.com/searchresults.en-us.html?label=gen173nr-1DCAEoggI46AdIM1gEaJcCiAEBmAExuAEHyAEM2AED6AEB-AECiAIBqAID&sid=03698db49867fbf1c71f30e1150e2d53&sb=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.html%3Flabel%3Dgen173nr-1DCAEoggI46AdIM1gEaJcCiAEBmAExuAEHyAEM2AED6AEB-AECiAIBqAID%3Bsid%3D03698db49867fbf1c71f30e1150e2d53%3Bsb_price_type%3Dtotal%26%3B&ss=Singapore&is_ski_area=0&ssne=Singapore&ssne_untouched=Singapore&dest_id=-73635&dest_type=city&checkin_month=2&checkin_monthday=22&checkin_year=2019&checkout_month=2&checkout_monthday=28&checkout_year=2019&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {
                hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
                hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
                if(hotelelement.querySelector('strong.price')){
                    hotelJson.price = hotelelement.querySelector('strong.price').innerText;
                }
            }
            catch (exception){

            }
            hotels.push(hotelJson);
        });
        return hotels;
    });

    console.dir(hotelData);
})();