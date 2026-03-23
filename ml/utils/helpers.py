import os
from config.config import DATASET_PATH

def get_label_map(dataset_path):
    label_map = {}
    current_label = 0

    for person in os.listdir(dataset_path):
        person_path = os.path.join(dataset_path, person)

        if not os.path.isdir(person_path):
            continue

        label_map[current_label] = person
        current_label += 1

    return label_map
