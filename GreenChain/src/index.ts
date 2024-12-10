import { v4 as uuidv4 } from "uuid";
import { StableBTreeMap } from "azle";
import express from "express";
import { time } from "azle";

// Definisi data aktivitas lingkungan
class Activity {
  id: string;
  contributor: string; // Nama kontributor
  description: string; // Deskripsi aktivitas
  points: number; // Poin reward yang diberikan
  createdAt: Date;
}

const activityStorage = StableBTreeMap<string, Activity>(0);

const app = express();
app.use(express.json());

// Menambahkan aktivitas baru
app.post("/activities", (req, res) => {
  const activity: Activity = {
    id: uuidv4(),
    contributor: req.body.contributor,
    description: req.body.description,
    points: req.body.points || 10,
    createdAt: getCurrentDate(),
  };
  activityStorage.insert(activity.id, activity);
  res.json(activity);
});

// Mendapatkan semua aktivitas
app.get("/activities", (req, res) => {
  res.json(activityStorage.values());
});

// Mendapatkan aktivitas berdasarkan ID
app.get("/activities/:id", (req, res) => {
  const activityId = req.params.id;
  const activityOpt = activityStorage.get(activityId);
  if (!activityOpt) {
    res.status(404).send(`Activity with id=${activityId} not found`);
  } else {
    res.json(activityOpt);
  }
});

// Menghapus aktivitas
app.delete("/activities/:id", (req, res) => {
  const activityId = req.params.id;
  const deletedActivity = activityStorage.remove(activityId);
  if (!deletedActivity) {
    res.status(400).send(`Activity with id=${activityId} not found`);
  } else {
    res.json(deletedActivity);
  }
});

app.listen();

function getCurrentDate() {
  const timestamp = Number(time());
  return new Date(timestamp.valueOf() / 1_000_000);
}
