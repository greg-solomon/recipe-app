import Recipe from "../models/Recipe";

export default async (hits: any) => {
  const toResolve = [];

  for (let hit of hits) {
    const { recipe } = hit;
    try {
      const _r = await Recipe.findOne({ url: recipe.url });

      if (!_r) {
        console.log(recipe.label);

        const r = new Recipe({
          label: recipe.label,
          image: recipe.image,
          source: { uid: null, displayName: recipe.source },
          url: recipe.url,
          dietLabels: recipe.dietLabels,
          healthLabels: recipe.healthLabels,
          cautions: recipe.cautions,
          ingredients: recipe.ingredients.map((ing: any) => ing.text),
          calories: recipe.calories,
          user_uploaded: false,
          date: Date.now(),
        });

        toResolve.push(r.save());
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  await Promise.resolve(toResolve);
  return Recipe.find();
};
