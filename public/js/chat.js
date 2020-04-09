const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
  '#location-message-template'
).innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value; //  document.querySelector('input[name=message]').value;

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageForm.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered');
  });
});

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationMessageTemplate, {
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$sendLocationButton.addEventListener('click', () => {
  //   if (!navigator.geolocation) {
  //     return alert('Geolocation is not supported by your browser');
  //   }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  //   navigator.geolocation.getCurrentPosition((position) => {
  //     socket.emit('sendLocation', {
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //     });
  //   });

  socket.emit(
    'sendLocation',
    {
      latitude: 123,
      longitude: 321,
    },
    () => {
      $sendLocationButton.removeAttribute('disabled');
      console.log('Location Shared');
    }
  );
});

socket.emit('join', { username, room });
