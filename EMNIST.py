#import dataset
from emnist import extract_training_samples
images, labels = extract_training_samples('byclass')
#define blank list and name of file
blank = [0]*62
filename = "EMNIST.json"
#clear file
with open(filename,"w") as file: file.write("")
##write data as an array of image and then label
with open(filename,"a") as file:
    file.write("[")
    for i in range(len(images)):
        #display progress
        print(i)
        file.write("[[")
        for j in range(28):
            file.write("[")
            for k in range(28):
                file.write(str(images[i][j][k])+",")
            file.write("],")
        file.write("],[")
        label = blank[0:labels[i]] + [1] + blank[labels[i]:62]
        for j in range(62):
            file.write(str(label[j])+",")
        file.write("]],")
    file.write("]")
#get data from file
with open(filename,"r") as file: data  = file.read()
#replace unneccessary commas
with open(filename,"w") as file: file.write(data.replace(",]","]"))
