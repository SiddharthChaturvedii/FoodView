const foods = [
    {
        name: "SeaFood",
        description: "Test Description"
    },
    {
        name: "Spicy Schezwan Noodles",
        description: "Hot and spicy noodles with veggies"
    },
    {
        name: "Vegetable Momos",
        description: "Steamed dumplings served with spicy chutney"
    }
];

const MOODS = [
    {
        id: 'vegan',
        keywords: ['vegan', 'plant', 'tofu', 'vegetarian', 'veggie', 'zen', 'artisan']
    }
];

const matches = foods.filter(food => {
    const searchText = `${food.name} ${food.description || ''}`.toLowerCase();
    const matchedKeyword = MOODS[0].keywords.find(keyword => searchText.includes(keyword.toLowerCase()));
    if (matchedKeyword) {
        console.log(`Matched "${food.name}" via keyword: "${matchedKeyword}"`);
        return true;
    }
    return false;
});

console.log("Matches:", matches.map(f => f.name));
