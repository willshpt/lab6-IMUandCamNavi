import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision


def get_results(image_file_name):
  names = 'none'
  base_options = python.BaseOptions(model_asset_path='gesture_recognizer.task')
  options = vision.GestureRecognizerOptions(base_options=base_options)
  recognizer = vision.GestureRecognizer.create_from_options(options)
  image = mp.Image.create_from_file(image_file_name)
  recognition_result = recognizer.recognize(image)
  if recognition_result.gestures != []:
    top_gesture = recognition_result.gestures[0][0]
    names=top_gesture.category_name

  return(names)

