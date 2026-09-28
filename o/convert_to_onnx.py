import tensorflow as tf
import tf2onnx

# Path to your TFLite model
tflite_model_path = "mobilefacenet.tflite"

# Output SavedModel directory
saved_model_dir = "saved_model"

# Output ONNX file
onnx_output_path = "mobilefacenet.onnx"

# Load TFLite model
interpreter = tf.lite.Interpreter(model_path=tflite_model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Assume single input/output for simplicity
input_shape = input_details[0]['shape']
input_dtype = input_details[0]['dtype']
output_shape = output_details[0]['shape']
output_dtype = output_details[0]['dtype']

# Create a tf.Module to wrap the inference
class TFLiteModel(tf.Module):
    def __init__(self, interpreter):
        self.interpreter = interpreter

    @tf.function(input_signature=[tf.TensorSpec(shape=input_shape, dtype=input_dtype)])
    def __call__(self, x):
        self.interpreter.set_tensor(input_details[0]['index'], x)
        self.interpreter.invoke()
        return self.interpreter.get_tensor(output_details[0]['index'])

model = TFLiteModel(interpreter)

# Save as SavedModel
tf.saved_model.save(model, saved_model_dir)

# Convert SavedModel to ONNX
import subprocess
subprocess.run(["python", "-m", "tf2onnx.convert", "--saved-model", saved_model_dir, "--output", onnx_output_path])

print("Conversion successful!")
print("Saved ONNX model:", onnx_output_path)