-- CreateTable
CREATE TABLE "Player" (
    "player_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "TeamPokemon" (
    "player_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "pokemon_id" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "exp" INTEGER NOT NULL,
    "move_list" INTEGER[],

    CONSTRAINT "TeamPokemon_pkey" PRIMARY KEY ("player_id","index")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "pokemon_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type1" TEXT NOT NULL,
    "type2" TEXT NOT NULL,
    "front_image" TEXT NOT NULL,
    "back_image" TEXT NOT NULL,
    "base_hp" INTEGER NOT NULL,
    "base_attack" INTEGER NOT NULL,
    "base_defence" INTEGER NOT NULL,
    "base_special_attack" INTEGER NOT NULL,
    "base_special_defence" INTEGER NOT NULL,
    "base_speed" INTEGER NOT NULL,
    "evolve_level" INTEGER NOT NULL,
    "move_list" INTEGER[],

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("pokemon_id")
);

-- CreateTable
CREATE TABLE "Move" (
    "move_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "damage_class" TEXT NOT NULL,
    "power" INTEGER NOT NULL,
    "pp" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "stat_name" TEXT[],
    "stat_rank" INTEGER[],
    "stat_target" TEXT NOT NULL,
    "stat_chance" INTEGER NOT NULL,
    "ailment" TEXT NOT NULL,
    "ailment_chance" INTEGER NOT NULL,
    "healing" INTEGER NOT NULL,
    "drain" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("move_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_player_id_key" ON "Player"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokemon_id_key" ON "Pokemon"("pokemon_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Move_move_id_key" ON "Move"("move_id");
