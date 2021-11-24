//Check if we are running in production environment or development env
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require('express');
const fs = require('fs');
const stripe = require('stripe')(stripeSecretKey);

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.listen(3000, function () {
    console.log('HomeJoy app listening on port 5000!');
  });

app.get('/welcome', function(req, res) {
    res.send('Welcome to HomeJoy website!');
});

app.get('/store', function(req,res){
    fs.readFile('items.json', function(error, data){
        if(error){
            res.status(500).end();
        }else{
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            });
        }
    });
});

app.post('/purchase', function(req,res){
    fs.readFile('items.json', function(error, data){
        if(error){
            res.status(500).end();
        }else{
            const itemsJson = JSON.parse(data);
            const itemsArray = itemsJson.music.concat(itemsJson.merch);
            let total = 0;
            req.body.items.forEach(function(item){
                const itemJson = itemsArray.find(function(i){
                    return i.id == item.id;
                });
                total = total + itemJson.price * item.quantity;
            });

            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(function(){
                console.log('Charge Successful');
                res.json({message: 'Successfully purchased items'});
            }).catch(function(){
                console.log('Charge Fail');
                res.status(500).end();
            });
        }
    });
});

app.listen(5000);
