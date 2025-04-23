const iyzipay = require('iyzipay');

const iyzico = new iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const { name, email, phone, address, items, total } = JSON.parse(event.body);

  const basketItems = items.map((item, index) => ({
    id: String(index + 1),
    name: item.name,
    category1: 'İç Giyim',
    itemType: 'PHYSICAL',
    price: (item.price * item.qty).toFixed(2)
  }));

  const request = {
    locale: 'tr',
    conversationId: 'mutaf-' + Math.floor(Math.random() * 1000000),
    price: total.toFixed(2),
    paidPrice: total.toFixed(2),
    currency: 'TRY',
    basketId: 'B67832',
    paymentGroup: 'PRODUCT',
    callbackUrl: 'https://extraordinary-pika-b0e044.netlify.app/tesekkurler.html',
    buyer: {
      id: 'BY789',
      name: name.split(' ')[0],
      surname: name.split(' ')[1] || '',
      gsmNumber: phone,
      email: email,
      identityNumber: '11111111111',
      registrationAddress: address,
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34000'
    },
    shippingAddress: {
      contactName: name,
      city: 'Istanbul',
      country: 'Turkey',
      address: address,
      zipCode: '34000'
    },
    billingAddress: {
      contactName: name,
      city: 'Istanbul',
      country: 'Turkey',
      address: address,
      zipCode: '34000'
    },
    basketItems: basketItems
  };

  return new Promise((resolve, reject) => {
    iyzico.checkoutFormInitialize.create(request, function (err, result) {
      if (err) {
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: err.message })
        });
      }

      resolve({
        statusCode: 200,
        body: JSON.stringify({ checkoutFormContent: result.checkoutFormContent })
      });
    });
  });
};
