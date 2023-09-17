import backend
from backend import *
import sys

x = open("data.txt", "w")
userInput = sys.argv[1].replace("{ searchField: '", "")
userInput = userInput.replace("' }", "")
temp_array = import_stock_data(userInput).to_numpy()
x.write(str(temp_array))
x.close()
#new_array = []
#for i in range(temp_array.size):
#    new_value = np.round(temp_array[i], 2)
#    new_array.append(float(new_value))
#x.write(str(new_array))
#x.close()

