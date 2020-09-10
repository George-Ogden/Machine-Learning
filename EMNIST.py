#import dataset
from emnist import extract_training_samples
images, labels = extract_training_samples('digits')
#define blank list and name of file
blank = [0]*10
length = len(images)
for n in range(5):
    filename = "EMNIST/{}.json".format(n+1)
    #clear file
    with open(filename,"w") as file: file.write("")
    #write data as an array of image and then label
    with open(filename,"a") as file:
        file.write("[")
        for i in range(int(n*length/5),int((n+1)*length/5)):
            #display progress
            print(i,"/",length,sep="")
            file.write("[[")
            for j in range(28):
                file.write("[")
                for k in range(28):
                    file.write(str(images[i][j][k])+",")
                file.write("],")
            file.write("],[")
            label = blank[0:labels[i]] + [1] + blank[labels[i]:10]
            for j in range(10):
                file.write(str(label[j])+",")
            file.write("]],")
        file.write("]")
    print(length,"/",length,sep="")
    #get data from file
    with open(filename,"r") as file: data  = file.read()
    #replace unneccessary commas
    with open(filename,"w") as file: file.write(data.replace(",]","]"))

