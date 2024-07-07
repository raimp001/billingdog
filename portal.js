document.addEventListener("DOMContentLoaded", function() {
    const patients = [
        { id: 1, name: 'John Doe', vitals: { heartRate: 70, bloodPressure: '120/80', temperature: 36.5, respiratoryRate: 16 } },
        { id: 2, name: 'Jane Smith', vitals: { heartRate: 75, bloodPressure: '118/76', temperature: 36.8, respiratoryRate: 18 } }
    ];

    const patientList = document.getElementById('patient-list');

    patients.forEach(patient => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.vitals.heartRate}</td>
            <td>${patient.vitals.bloodPressure}</td>
            <td>${patient.vitals.temperature}</td>
            <td>${patient.vitals.respiratoryRate}</td>
            <td><button onclick="callPatient(${patient.id})">Call</button></td>
        `;

        patientList.appendChild(tr);
    });
});

function callPatient(patientId) {
    alert(`Calling patient with ID: ${patientId}`);
    // Here you would integrate with your video call API or service
}

