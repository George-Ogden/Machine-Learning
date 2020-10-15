import json
data = {}
start = {}
with open("dinosaurs.csv") as file:
    for line in file:
        line = line.lower().replace("\n","{")
        for i in range(len(line)-1):
            snippet = line[0:i]
            letter = line[i]
            if snippet not in start.keys():
                start[snippet] = {}
            if letter not in start[snippet].keys():
                start[snippet][letter] = 0
            start[snippet][letter] += 1
            for j in range(len(line)-i):
                snippet = line[j:j+i]
                letter = line[j+i]
                if snippet not in data.keys():
                    data[snippet] = {}
                if letter not in data[snippet].keys():
                    data[snippet][letter] = 0
                data[snippet][letter] += 1
# for key in data:
#     data[key] = max(data[key],key=data[key].get)
with open("analysis.json","w") as file:
    file.write(json.dumps(data))
with open("f-analysis.json","w") as file:
    file.write(json.dumps(start))