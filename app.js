const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
//let items = ["Completed tasks below!"];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.connect(
	'mongodb+srv://admin-piyusha:Test1234@cluster0.pams6.mongodb.net/todolistDB',
	{
		useNewUrlParser: true,
	},
);
// mongoose.connect(process.env.MONGODB_URL, {
// 	useNewUrlParser: true,
// });

const itemsSchema = {
	name: String,
};

const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({
	name: 'Welcome to your To do List!',
});
const item2 = new Item({
	name: 'Hit the + button to add a new task.',
});
const item3 = new Item({
	name: '<--- Hit this if certain task is done.',
});
const defaultItems = [item1, item2, item3];

app.get('/', function (req, res) {
	let today = new Date();
	let options = {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	};

	let day = today.toLocaleDateString('en-US', options);
	Item.find({}, function (err, foundItems) {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log('Added items to list!');
				}
			});
			res.redirect('/');
		} else {
			res.render('list', { kindOfDay: day, newListItem: foundItems });
		}
	});
});
app.post('/', function (req, res) {
	const itemName = req.body.newItem;
	const item = new Item({
		name: itemName,
	});
	item.save();
	res.redirect('/');
});
app.post('/delete', function (req, res) {
	const checkedItemId = req.body.checkbox;
	Item.findByIdAndRemove(checkedItemId, function (err, item) {
		if (!err) {
			res.redirect('/');
			console.log('Successfully deleted checked item');
		}
	});
});

let port = process.env.PORT || 3000;
if (port == null || port == '') {
	port = 3000;
}

app.listen(port, function () {
	console.log('Server started successfully');
});
