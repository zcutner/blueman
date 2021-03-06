var district, latitude, longitude, counter = 0;

var question = {
    init: function(details) {
        counter++;
        this.question = details.id;

        $('nav').prepend('<span>' + counter + '</span>');
        $('.info p').html(details.text);

        if(details.image) $('.info img').attr('src', details.image).show();
        else $('.info img').hide();

        $('.info').css('opacity', '1');
    },

    submit: function(answer) {
        $('.info').css('opacity', '0').one('transitionend', function() {
            $.post('/api/', {
                district: district,
                id: question.question,
                answer: answer
            }, function(data) {
                if(data.question) question.init(data.question);
                else if(data.statement) statement.init(data.statement);
            });
        });
    }
};

var statement = {
    init: function(details) {
        counter++;

        $('nav').prepend('<span>' + counter + '</span>');
        $('.info p').html(details.text);

        if(details.image) $('.info img').attr('src', details.image).show();
        else $('.info img').hide();

        $('#yes, #no, #question').hide();
        $('#restart, #statement').show();

        $('.info').css('opacity', '1');
    },

    submit: function() {
        $('.info').css('opacity', '0').one('transitionend', function() {
            $('#yes, #no, #question').show();
            $('#restart, #statement').hide();
            $('nav').empty();
            counter = 0;
            init();
        });
    }
};

$('#yes').click(function(e) {
    e.preventDefault();
    question.submit(true);
});

$('#no').click(function(e) {
    e.preventDefault();
    question.submit(false);
});

$('#restart').click(function(e) {
    e.preventDefault();
    statement.submit();
});

function init() {
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            $.post('/api/', {
                latitude: latitude,
                longitude: longitude
            }, function(data) {
                district = data.district;
                if(data.question) question.init(data.question);
                else if(data.statement) statement.init(data.statement);
                else console.log('The response from the server could not be read!');
            });
        });
    } else {
        console.log('Geolocation has been blocked or is not supported on this device!');
    }
}

init();
