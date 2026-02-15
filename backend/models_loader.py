import os
import joblib
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
MODELS_PATH = os.path.join(PROJECT_ROOT, "models")

# Load Heart Model
heart_model = joblib.load(os.path.join(MODELS_PATH, "heart_failure_rf_model.pkl"))

# Load Oral Cancer Model
oral_model = tf.keras.models.load_model(
    os.path.join(MODELS_PATH, "oral_cancer_model.h5")
)
